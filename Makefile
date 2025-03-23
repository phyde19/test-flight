
.PHONY: start

start:
	npx concurrently \
		--names "backend,frontend" \
		--prefix-colors "cyan,green" \
		"fastapi dev backend/main.py" \
		"cd frontend && npm run dev"

frontend_install:
	@cd frontend && npm i

backend_install:
	@pip install -r backend/requirements.txt