back:
	@echo 'Back...'
	./travelPlanner

db:
	@echo 'DB...'
	sudo service postgresql start && psql gorm_travel

front:
	@echo 'Front...'
	cd frontend && npm run dev

stop:
	@echo "Stopping services..."
	-pkill -f "npm run dev"
	-pkill -f "travelPlanner"