include .env

build-ingestor:
	${DOCKER_PATH} build ingestor-v2 -t ${INGESTOR_IMAGE}

create-jobs:
	${DOCKER_PATH} run --rm -d --env-file .env --network custom_network ${INGESTOR_IMAGE} npm run createJobs

start-workers:
	${DOCKER_PATH} run --rm -d --env-file .env --network custom_network ${INGESTOR_IMAGE} npm run startWorkers

start-server:
	${DOCKER_PATH} run --rm -d -p 3000:3000 --env-file .env --network custom_network ${INGESTOR_IMAGE} npm run start

ingestor-start-cron:
	(crontab -l | echo "${INGESTOR_CRON} cd ${PATH} && make create-jobs") | crontab -

ingestor-delete-cron:
	(crontab -l | grep -v create-jobs) | crontab -