.PHONY: client
client:
	cd client && yarn next

.PHONY: server
server:
	docker-compose -f docker-compose.yaml up --build
