CREATE ROLE dev WITH LOGIN = true AND PASSWORD = 'dev';
CREATE ROLE test WITH LOGIN = true AND PASSWORD = 'test';
CREATE ROLE prod WITH LOGIN = true AND PASSWORD = 'prod';

ALTER ROLE dev WITH superuser = true;