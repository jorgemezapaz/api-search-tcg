docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans

docker-compose -f docker-compose.dev.yml up --build

sleep 2

docker volume rm $(docker volume ls -q --filter "name=97b2469cc09f9a13a11c7ca68e5396851bd3ae50f20471ed6409b29dd0eb2771")
