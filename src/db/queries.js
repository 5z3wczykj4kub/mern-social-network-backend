/**
 * This SQL command queries for homepage posts.
 * Posts that are being returned
 * belong to the requesting user
 * or his friends.
 * @param {Number} userId
 * @param {Number} cursor
 * @param {Number} limit
 * @param {Boolean} isCounting
 * @returns {String} SQL query
 */
const getHomepagePostsQuery = (userId, cursor, limit, isCounting = false) => `
  SELECT 
    ${isCounting ? 'COUNT(*) AS count' : '*'}
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
      p.authorId = ${userId}
        OR p.authorId IN (SELECT 
          u.id
        FROM
          Users u
        INNER JOIN Friends f ON u.id = f.requesterId
          AND f.receiverId = ${userId}
        WHERE
          status = 'accepted' UNION SELECT 
          u.id
        FROM
          Users u
        INNER JOIN Friends f ON u.id = f.receiverId
          AND f.requesterId = ${userId}
        WHERE
          status = 'accepted')
    ORDER BY id DESC) P
  ${
    cursor
      ? `
        WHERE
          id < ${cursor}
      `
      : ''
  }
  ${isCounting ? '' : `LIMIT ${limit}`};
`;

/**
 * This SQL query returns user's friends.
 * @param {Number} userId
 * @param {Number} cursor
 * @param {Number} limit
 * @param {Boolean} isCounting
 * @returns {String} SQL query
 */
const getUserFriendsQuery = (userId, cursor, limit, isCounting = false) => `
  SELECT 
    ${isCounting ? 'COUNT(*) AS count' : '*'}
  FROM
    (SELECT 
      f.id, u.id AS userId, u.firstName, u.lastName
    FROM
      Users u
    INNER JOIN Friends f ON u.id = f.requesterId
      AND f.receiverId = ${userId}
    WHERE
      status = 'accepted' UNION SELECT 
      f.id, u.id AS userId, u.firstName, u.lastName
    FROM
      Users u
    INNER JOIN Friends f ON u.id = f.receiverId
      AND f.requesterId = ${userId}
    WHERE
      status = 'accepted'
    ORDER BY id DESC) U
  ${
    cursor
      ? `
        WHERE
          id < ${cursor}
      `
      : ''
  }
  ${isCounting ? '' : `LIMIT ${limit}`};
`;

export { getHomepagePostsQuery, getUserFriendsQuery };
