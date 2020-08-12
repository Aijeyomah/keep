export default {
  createTask: `INSERT INTO list(
      user_id,
      title
  )VALUES($1, $2) RETURNING *;
`,

  createItems: `INSERT INTO items(
    list_id,
    task,
    status,
    due_date      
    ) VALUES($1, $2, $3, $4) RETURNING *;
    `,

  createNotification: ` INSERT INTO notifications(
    user_id,
    seen_by_user,
    task_id
  ) VALUES($1, $2, $3) RETURNING *`,

  fetchUserId: ` SELECT * FROM list WHERE id=($1);
   `,
  fetchItem: `SELECT * FROM items WHERE id=($1);
   `,
  deleteItem: `DELETE FROM items WHERE id=($1);`,
  updateStatus: `UPDATE items SET status=($1) WHERE id=($2);`,
  searchItem: `SELECT li.*, it.*  FROM list li INNER JOIN items it ON it.list_id = li.id WHERE li.title ILIKE '%' || $1|| '%'`,
  getTask: `SELECT  it.*, li.user_id 
  FROM items it 
  INNER JOIN list li ON it.list_id = li.id 
  LEFT JOIN notifications noti ON it.id = noti.task_id where it.due_date < now() 
  AND noti.task_id IS NULL`,
  
  updateNotificationRead: `UPDATE notifications SET seen_by_user=($1) 
    WHERE id=($2)`,
  sendNotificationToUser: `SELECT * FROM items i JOIN notifications n 
  ON i.id = n.task_id WHERE n.seen_by_user = 'no'`,
  fetchUserTaskByPagination: `
  SELECT it.*, 
  li.title ,
  li.user_id 
  FROM items it INNER JOIN list li 
  ON it.list_id = li.id 
  WHERE li.user_id = ($3) 
  ORDER BY it.created_at 
  DESC OFFSET $1
  LIMIT  $2`,
  
  countTaskPerUser: `
   SELECT l.id, 
    COUNT(i.id) as itemCount 
    FROM list l
    INNER JOIN items i
    ON i.list_id = l.id 
    WHERE l.user_id= ($1)   
     GROUP BY l.id 
    ORDER BY COUNT(i.id)
    `
};
