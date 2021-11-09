# office-queue-management

A system that manages the queues for desk services open the public

## Docker

For development mode:

```sh
docker-compose stop && docker-compose up --build -d --remove-orphans
```

For production mode:

```sh
docker-compose -f docker-compose.prod.yml stop && docker-compose -f docker-compose.prod.yml up --build -d
```
