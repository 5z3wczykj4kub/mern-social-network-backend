-- Get all users
SELECT 
    *
FROM
    Users;
		

-- Get user by id
SELECT 
    *
FROM
    Users
WHERE
    id = 9;

-- Get all posts
SELECT 
    *
FROM
    Posts;

-- Get posts of a given user
SELECT 
    p.id,
    p.content,
    p.media,
    p.createdAt,
    u.id,
    u.firstName,
    u.lastName,
    u.avatar
FROM
    Posts p
        INNER JOIN
    Users u ON p.authorId = u.id
WHERE
    p.authorId = 3;
    
-- Get many posts for homepage
SELECT 
    COUNT(*)
FROM
    (SELECT 
        p.id,
            p.content,
            p.media,
            p.createdAt,
            u.id authorId,
            u.firstName,
            u.lastName,
            u.avatar
    FROM
        Posts p
    INNER JOIN Users u ON p.authorId = u.id
    WHERE
        p.authorId = 3
            OR p.authorId IN (SELECT 
                u.id
            FROM
                Users u
            INNER JOIN Friends f ON u.id = f.requesterId
                AND f.receiverId = 3
            WHERE
                status = 'accepted' UNION SELECT 
                u.id
            FROM
                Users u
            INNER JOIN Friends f ON u.id = f.receiverId
                AND f.requesterId = 3
            WHERE
                status = 'accepted')
    ORDER BY id DESC) P
WHERE
    id < 2
LIMIT 3;

-- Get all friendships
SELECT 
    *
FROM
    Friends;

-- Add John's friends
INSERT INTO 
	Friends(status, createdAt, updatedAt, requesterId, receiverId) 
VALUES 
	('accepted', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 14, 1);

-- Get all friendships filled with user names
SELECT 
    Friends.id,
    status,
    requesterId,
    CONCAT(requesters.firstName,
            ' ',
            requesters.lastName) AS requesterFullname,
    receiverId,
    CONCAT(receivers.firstName,
            ' ',
            receivers.lastName) AS receiverFullname
FROM
    Friends
        INNER JOIN
    Users requesters ON Friends.requesterId = requesters.id
        INNER JOIN
    Users receivers ON Friends.receiverId = receivers.id;
  
-- Get friendships by id
SELECT 
    f.id, u.id AS userId, u.firstName, u.lastName
FROM
    Users u
        INNER JOIN
    Friends f ON u.id = f.requesterId
        AND f.receiverId = 1 
UNION SELECT 
    f.id, u.id AS userId, u.firstName, u.lastName
FROM
    Users u
        INNER JOIN
    Friends f ON u.id = f.receiverId
        AND f.requesterId = 1
ORDER BY id DESC;

-- Get friends of a given user by his id
SELECT 
    *
FROM
    (SELECT 
        f.id, u.id AS userId, u.firstName, u.lastName
    FROM
        Users u
    INNER JOIN Friends f ON u.id = f.requesterId
        AND f.receiverId = 4
    WHERE
        status = 'accepted' UNION SELECT 
        f.id, u.id AS userId, u.firstName, u.lastName
    FROM
        Users u
    INNER JOIN Friends f ON u.id = f.receiverId
        AND f.requesterId = 4
    WHERE
        status = 'accepted'
    ORDER BY id DESC) U
WHERE
    id < 220;