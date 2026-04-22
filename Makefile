.PHONY: help test build compile ingest serve serve-bg stop open e2e clean

PORT ?= 8080
URL  := http://localhost:$(PORT)/
PIDFILE := .make.serve.pid
OPEN := $(shell command -v open 2>/dev/null || command -v xdg-open 2>/dev/null)

help:
	@echo "타겟 목록:"
	@echo "  make test       Node 내장 테스트 러너로 scripts/*.test.mjs 실행"
	@echo "  make compile    raw/nodes/ + legacy-*.js → docs/data.js + docs/nodes.json"
	@echo "  make build      compile + docs/references.json 재생성"
	@echo "  make ingest     compile + graphify update + build-references 연쇄 실행"
	@echo "  make serve      docs/ 를 루트로 http.server 를 포그라운드 실행 (Ctrl+C 로 종료)"
	@echo "  make serve-bg   위와 같지만 백그라운드에서 — PID 는 $(PIDFILE) 에 기록"
	@echo "  make stop       백그라운드 서버 종료"
	@echo "  make open       현재 실행 중인 서버 URL 을 기본 브라우저로 열기"
	@echo "  make e2e        serve-bg + open + 확인 항목 체크리스트 출력"
	@echo "  make clean      백그라운드 서버 종료 + 임시 파일 정리"

test:
	npm test

compile:
	node scripts/compile-nodes.mjs

build: compile
	node scripts/build-references.mjs

ingest: compile
	bash scripts/ingest.sh

serve:
	@echo "→ $(URL)"
	python3 -m http.server $(PORT) -d docs

# --- 백그라운드 서버 ---------------------------------------------------

serve-bg: stop
	@python3 -m http.server $(PORT) -d docs > .make.serve.log 2>&1 & echo $$! > $(PIDFILE)
	@sleep 0.5
	@if ! kill -0 $$(cat $(PIDFILE)) 2>/dev/null; then \
		echo "서버 시작 실패. .make.serve.log 확인"; cat .make.serve.log; rm -f $(PIDFILE); exit 1; \
	fi
	@echo "서버 PID $$(cat $(PIDFILE)) · $(URL) · 로그 .make.serve.log"

stop:
	@if [ -f $(PIDFILE) ]; then \
		PID=$$(cat $(PIDFILE)); \
		if kill -0 $$PID 2>/dev/null; then kill $$PID; echo "stopped PID $$PID"; fi; \
		rm -f $(PIDFILE); \
	else \
		echo "백그라운드 서버 없음"; \
	fi

open:
	@if [ -z "$(OPEN)" ]; then \
		echo "브라우저 열기 명령(open / xdg-open) 을 찾지 못했습니다. 다음 URL 을 직접 여세요: $(URL)"; \
	else \
		$(OPEN) "$(URL)"; \
	fi

# --- E2E 체크 ----------------------------------------------------------

e2e: test serve-bg
	@sleep 0.5
	@if command -v curl >/dev/null 2>&1; then \
		STATUS=$$(curl -s -o /dev/null -w "%{http_code}" $(URL)); \
		if [ "$$STATUS" != "200" ]; then \
			echo "ERROR: $(URL) returned HTTP $$STATUS — 서버 기동 실패"; \
			$(MAKE) stop; exit 1; \
		fi; \
		REFS_STATUS=$$(curl -s -o /dev/null -w "%{http_code}" $(URL)references.json); \
		if [ "$$REFS_STATUS" != "200" ]; then \
			echo "WARN: references.json 응답 $$REFS_STATUS (사이트는 fallback 으로 정상 작동)"; \
		else \
			MAPPED=$$(curl -s $(URL)references.json | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const j=JSON.parse(d);console.log(j.stats.mappedNodes+"/"+j.stats.totalSources)})'); \
			echo "references.json: $$MAPPED nodes mapped"; \
		fi; \
		NODES_STATUS=$$(curl -s -o /dev/null -w "%{http_code}" $(URL)nodes.json); \
		if [ "$$NODES_STATUS" != "200" ]; then \
			echo "WARN: nodes.json 응답 $$NODES_STATUS (사이트는 fallback 으로 정상 작동)"; \
		else \
			NODE_COUNT=$$(curl -s $(URL)nodes.json | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const j=JSON.parse(d);console.log(Object.keys(j.nodes).length)})'); \
			echo "nodes.json: $$NODE_COUNT node bodies"; \
		fi; \
	fi
	@$(MAKE) open
	@echo ""
	@echo "브라우저에서 다음을 확인:"
	@echo "  1. 그래프가 중심→가지로 리플 애니메이션을 보여주는가"
	@echo "  2. 'dsql' 검색 → 클릭 → 본문이 풍부한 HTML로 렌더되는가 (wiki-link 포함)"
	@echo "  3. 본문의 [[serverless]] 링크 클릭 → serverless 노드로 포커스 이동하는가"
	@echo "  4. 'git' 등 legacy 노드 클릭 시 짧은 본문이 여전히 잘 뜨는가"
	@echo "  5. 언어 전환(KO/EN/JA) 시 본문·섹션 제목이 바뀌는가"
	@echo ""
	@echo "확인 후 'make stop' 으로 서버 종료."

clean: stop
	@rm -f .make.serve.log
	@echo "cleaned"
