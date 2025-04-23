
function determineWinner({player,enemy,timerID}){
    clearTimeout(timerID)
    document.querySelector('#displayText').style.display='flex'//Oyun bitince sonucu göstermek için
    if (player.health==enemy.health) {
        
        document.querySelector('#displayText').innerHTML='Tie'
     
        }else if(player.health>enemy.health){
         document.querySelector('#displayText').innerHTML='Player 1 Win'
     
        }else if(player.health<enemy.health){
         document.querySelector('#displayText').innerHTML='Player 2 Win'
     
        }
}
function rectangularCollesion({rectangel1,rectangel2}){//bu attack algılamayı daha toplu olsun diye yapıldı 2 kere bu uzun kod yazılmasın diye retun olarak tek yere döncek
    return(rectangel1.attackBox.position.x + rectangel1.attackBox.width >= rectangel2.position.x && rectangel1.attackBox.position.x <= rectangel2.position.x + rectangel2.width && rectangel1.attackBox.position.y + rectangel1.attackBox.height >= rectangel2.position.y && rectangel1.attackBox.position.y <= rectangel2.position.y + rectangel2.height && rectangel1.isAttacking)
   
}
let timer=60
let timerID
function decreasTimer(){
  
    if(timer>0){ 
       timerID=setTimeout(decreasTimer,1000)
        timer--
    document.querySelector('#timer').innerHTML=timer
  
   
    }
    if(timer==0){
       
  determineWinner({player,enemy,timerID})
}
}