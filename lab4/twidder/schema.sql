create table user
(
    email varchar(100) primary key,
    password varchar(100) not null,
    firstname varchar(30) not null,
    familyname varchar(30) not null,
    gender varchar(10) not null,
    city varchar(30) not null,
    country varchar(30) not null
);

create table messages
(
	msg_id integer primary key autoincrement,
	sender_email varchar(30) not null,
	receiver_email varchar(30) not null,
	message varchar(200),
	foreign key (sender_email) references user(email),
	foreign key (receiver_email) references user(email)
);

create table token
(
	token varchar(40) primary key,
	user_email varchar(100) not null,
	foreign key (user_email) references user(email)
);