import Header from './Header';
import Schedule from './Schedule';
import {useState} from 'react';
function App() {
  const date=new Date();
  const [periods,setPeriods]=useState(["P1","P2","P3","P4"]);
  const [user,setUser]=useState(undefined);
  function loginUser(user){
    const u =user
    if(u){
      console.log(u);
      setPeriods([u.P1,u.P2,u.P3,u.P4]);
      setUser(u);
    }
  }
  return (  
    <>
      <Header gotUser={(user)=>{
        console.log('app.js',user)
        loginUser(user)}} user={user}/>
      <Schedule day={date.getDate()%2===0? 2: 1} P1={periods[0]} P2={periods[1]} P3={periods[2]} P4={periods[3]}/>
    </>
  );
}

export default App;
