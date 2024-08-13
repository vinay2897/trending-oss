include .env

build-ingestor:
	docker build ingestor -t ${INGESTOR_IMAGE}

run-ingestor:
	docker run -it --rm -e GITHUB_TOKEN=${GITHUB_TOKEN} -e MONGO_USER=${MONGO_USER} -e MONGO_PASSWORD=${MONGO_PASSWORD} -e MONGO_HOST=${MONGO_HOST} -e MONGO_PORT=${MONGO_PORT} -e MONGO_DATABASE=${MONGO_DATABASE} --network custom_network ${INGESTOR_IMAGE} python job.py ${MIN_STARS} ${PAGE_SIZE}

ingestor-start-cron:
	(crontab -l | echo "${INGESTOR_CRON} make run-ingestor") | crontab -

ingestor-delete-cron:
	(crontab -l | grep -v run-ingestor) | crontab -