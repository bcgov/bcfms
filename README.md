# BC Fossil Management System
BC Fossil Management Office implementation of Arches
![Lifecycle:Maturing](https://img.shields.io/badge/Lifecycle-Maturing-007EC6)

## Prerequisites
- Docker Desktop

## Project Setup
1. Create a directory called `bcfms`
2. Open a terminal and navigate to the `bcfms` directory
3. Run the following to clone the repositories required for this project:
``` shell
git clone https://github.com/bcgov/arches-dependency-containers
git clone https://github.com/bcgov/arches
git clone https://github.com/bcgov/arches_common
git clone https://github.com/bcgov/bcfms
git clone https://github.com/archesproject/arches-component-lab
git clone https://github.com/archesproject/arches-querysets
```

- You should now have the following directory structure:
```
.
└── 📁 bcfms/
    ├── 📁 arches-dependency-containers/
    ├── 📁 arches/
    ├── 📁 arches_common/
    ├── 📁 bcfms/
    ├── 📁 arches-component-lab/
    └── 📁 arches-querysets/
```

## Arches
1. Open or navigate to the `bcfms` directory in the terminal
2. Run the following command:
```
cd arches && git checkout stable/7.6.12_bcgov
```

## Arches Dependency Containers
- We need to load the base dependencies needed for Arches (i.e., Postgres, Elasticsearch, Redis, etc).
1. Open or navigate to the `bcfms` directory in the terminal
2. Run the following command to setup the project's dependencies:
```
cd arches-dependency-containers/arches-7-5-2 && docker compose up -d
```

## bcfms

### Prerequisites
- An .env file

### Setup

#### Docker Desktop
1. Open or navigate to the `bcfms` directory in the terminal
2. Run the following command:
```
cd bcfms && docker compose up -d
```
3. Let the `bcfms7-6` container fully load (i.e., watch the "Logs" tab). There will be a warning about missing environment variables.
    - You will see: `django.core.exceptions.ImproperlyConfigured: Set the BCGOV_PROXY_PREFIX environment variable`
    - This can take some time.
4. You need to create or move the .env file to `bcfms/bcfms/.env`
5. Restart the `bcfms7-6` container in Docker Desktop

#### `test_user_list.py`
1. Create  `test_user_list.py` in `bcfms/bcfms/bcfms/management/data/test_user_list.py`
2. Put the following function in the `test_user_list.py` file if you do not have an IDIR username/password:

```
def get_user_list():
    return [
        {
            "name": "testuser123",
            "email": "test@email.com",
            "password": "Test12345!",
            "is_superuser": True,
            "is_staff": True,
            "first_name": "Test",
            "last_name": "User",
            "groups": [
                "Resource Editor",
                "Resource Reviewer",
                "Archaeology Branch",
                "Resource Exporter"
            ]
        }
    ]
```
3. Put the following function in the `test_user_list.py` file if you do have an IDIR username/password:
```
def get_user_list():
    return [
        {
            "name": "<idir username>@idir",
            "email": "<email>",
            "password": "Test12345!",
            "is_superuser": True,
            "is_staff": True,
            "first_name": "<first name>",
            "last_name": "<last name>",
            "groups": [
                "Resource Editor",
                "Resource Reviewer",
                "Archaeology Branch",
                "Resource Exporter",
            ],
        },
    ]
```
- The password is a dummy password so it can be left as is.
- OIDC is used so when authenticating you will use your IDIR username and password.
- The `@idir` suffix is necessary
- The `<idir username>` must be in lowercase
4. Start and open the `bcfms7-6` container in Docker Desktop
5. Go to the "Exec" tab and run the following:
```
python3.11 manage.py bc_test_users --refresh REFRESH
```
6. Open the "Inspect" tab in the container
7. `Ctrl + F` for `Networks` and look for `IPAddress`
8. Copy the IP Address and open the `bcfms/bcfms/.env` file
9. Add the IP Address to the `AUTH_BYPASS_HOSTS` variable:
    - `AUTH_BYPASS_HOSTS = ... ... <IPAddress>`

10. Open the `bcfms7-6` container in Docker Desktop
11. Go to the "Exec" tab and run the following:
```
npm run build_development
python3.11 manage.py setup_db
```

You should now be able to access BCFMS at http://localhost:81/bc-fossil-management

12. After logging into BCFMS, the map will initially be blank. 
- You must navigate to the "System Settings" from the menu on the left-hand side, and enter your `Mapbox` token there.