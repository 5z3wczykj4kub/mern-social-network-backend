-- Get all users
select * from Users;

-- Get user by id
select * from Users where id = 9;

-- Get all friendships
select * from Friends;

-- Get all friendships filled with user names
select Friends.id, status,
  requesterId,
  concat(requesters.firstName, ' ', requesters.lastName) as requesterFullname,
  receiverId,
  concat(receivers.firstName, ' ', receivers.lastName) as receiverFullname
from Friends
  inner join Users requesters on Friends.requesterId = requesters.id
  inner join Users receivers on Friends.receiverId = receivers.id;
  
-- Get friendships by id
select f.id , u.id as userId, u.firstName, u.lastName from Users u inner join Friends f on u.id = f.requesterId and f.receiverId = 9
union
select f.id , u.id as userId, u.firstName, u.lastName from Users u inner join Friends f on u.id = f.receiverId and f.requesterId = 9
order by id desc;

-- Get friends of a given user by his id
select * from
(select f.id , u.id as userId, u.firstName, u.lastName from Users u inner join Friends f on u.id = f.requesterId and f.receiverId = 8 where status = 'accepted'
union
select f.id , u.id as userId, u.firstName, u.lastName from Users u inner join Friends f on u.id = f.receiverId and f.requesterId = 8 where status = 'accepted'
order by id desc) U where id < 20;