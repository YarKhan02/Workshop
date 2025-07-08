after git pull do this

```pip install -r requirements.txt```

Create a .env file in backend and define your DB credentials:
```
DB_NAME=workshop
DB_USER=yarkhan
DB_PASSWORD=yarkhanworkshop
DB_HOST=localhost
DB_PORT=5432
```

run in terminal inside backend folder
```
./bin/reset-db.sh
```

run the code
```
python manage.py runserver
```

login credentials in website
```
adminuser
adminpass123
```