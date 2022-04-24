FROM php:8.0-apache

COPY ./docker/apache/000-default.conf /etc/apache2/sites-enabled/000-default.conf

RUN apt update \
        && apt install -y \
            libicu-dev \
            libpq-dev \
            libzip-dev \
            zip \
            zlib1g-dev \
            netcat \
        && docker-php-ext-install \
            intl \
            opcache \
            pdo_mysql \
            mysqli

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
RUN npm install npm@latest -g

COPY ./src /var/www/html

RUN  a2enmod rewrite

RUN chown -R www-data:www-data /var/www/html

WORKDIR /var/www/html

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ARG MYSQL_PASSWORD \
    MYSQL_ROOT_PASSWORD \
    MYSQL_HOST

ENV DB_PASSWORD=${MYSQL_PASSWORD} \
    DB_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
    DB_HOST=${MYSQL_HOST}

RUN npm run production

# RUN chmod -R 775 /var/www/laravel_docker/storage/logs