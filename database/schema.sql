drop database if exists etsy;

create database etsy;

use etsy;

create table shops (
  shop_id int not null auto_increment,
  shop_name varchar(100) not null,
  primary key (shop_id)
);

create table products (
  product_id int not null auto_increment,
  product_name varchar(255) not null,
  product_thumbnail varchar(255),
  primary key (product_id)
);

create table customers (
  customer_id int not null auto_increment,
  customer_name varchar(255) not null,
  customer_avatar varchar(255),
  primary key (customer_id)
);

create table product_list (
  shop_id int not null,
  product_id int not null,
  foreign key (shop_id) references shops(shop_id),
  foreign key (product_id) references products(product_id)
);

create table reviews (
  review_id int not null auto_increment,
  customer_id int not null,
  product_id int not null,
  review_text text not null,
  review_score int not null,
  review_image varchar(255),
  review_date date not null,
  primary key(review_id),
  foreign key (customer_id) references customers(customer_id),
  foreign key (product_id) references products(product_id)
);