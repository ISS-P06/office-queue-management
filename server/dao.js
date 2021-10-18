import db from './db';
import dayjs from 'dayjs'

// Get available services
export function getServices  () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id , name FROM Service_Type';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
}

export async function getTicket(serviceID) {
  let today = dayjs();
  //console.log(today.format('YYYY-MM-DD'))
}

function maxTicketNum (serviceID){
  let today = dayjs().format('YYYY-MM-DD');
  return new Promise((resolve ,reject)=> {
    let sql = 'SELECT MAX(ticket_number) AS lastNumber FROM Ticket where date = ? AND ref_service = ? ';
    db.get(sql , [today , serviceID], (err , lastNumber)=>{
      if  (err )
        reject(err);
      else
        resolve (lastNumber.lastNumber);
    })
  })
}

export async function insertNewTicket(serviceID){
  let maxTicketNumber =await maxTicketNum(serviceID);
  let ticketNumber = maxTicketNumber +1 ;
  let today = dayjs().format('YYYY-MM-DD');
  return new Promise((resolve, reject) =>{
    const sql = 'INSERT INTO Ticket(id , ref_service ,date , status ,ticket_number) VALUES (?,?,?,?,?)'
    db.run(sql, [null ,serviceID , today , 'in-queue' , ticketNumber] ,(err) =>{
      if(err)
        reject(err);
      else
        resolve(0);
    })

  })
}