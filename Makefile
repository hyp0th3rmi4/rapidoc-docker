COMMIT ?= 0000000
DOCKER_IMAGE ?= rapidoc:latest


.PHONY: build
build: Dockerfile docker
	docker build --build-arg commit=$(COMMIT) -t $(DOCKER_IMAGE) .
	touch .build_image

.build_image: build

.PHONY: start
start:  .build_image
	docker-compose up

.PHONY: stop
stop: 
	docker-compose down

.PHONY: clean
clean:
	-docker-compose down
	-docker rmi $(DOCKER_IMAGE)
	-rm .build_image
