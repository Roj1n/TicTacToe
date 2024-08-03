const Tile = ({className,value,onClick,playerTurn}) => {

    let hoverstatus="";
     
    if(playerTurn != null && value== null ){
        hoverstatus=`${playerTurn.toLowerCase()}-hover`

    }

    
    return (<div  onClick={onClick}   className={`tile ${className} ${hoverstatus}`}> {value}</div>  );
}
 
export default Tile;