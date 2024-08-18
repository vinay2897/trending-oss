include .env

build-ingestor:
	docker build ingestor-v2 -t ${INGESTOR_IMAGE}

create-jobs:
	docker run --rm -d --env-file .env --network custom_network ${INGESTOR_IMAGE} npm run createJobs

start-workers:
	docker run --rm -d --env-file .env --network custom_network ${INGESTOR_IMAGE} npm run startWorkers

start-server:
	docker run --rm -d -p 3000:3000 --env-file .env --network custom_network ${INGESTOR_IMAGE} npm run start

ingestor-start-cron:
	(crontab -l | echo "${INGESTOR_CRON} make create-jobs") | crontab -

ingestor-delete-cron:
	(crontab -l | grep -v create-jobs) | crontab -