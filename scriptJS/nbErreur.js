var data;
var charge = 0;
var date1, date2;
		
var id;
var animation = false;

function update()//fonction appelée lors du click sur valider
{
	var xhr = new XMLHttpRequest();//création de la requête
	date1 = document.getElementById('date1').value;
	date2 = document.getElementById('date2').value;
	var resultat = document.getElementById('resultat');
	date1 =encodeURIComponent(date1);
	date2 = encodeURIComponent(date2);
	
	xhr.open('GET', 'http://projettuteure.fr/visualisation-logs/scriptPhp/basePhp.php?date1='+date1+'&date2='+date2);//parametrage de la requête
	xhr.send(null);//envoi de la requete
		
	xhr.onreadystatechange = function() {
					if (xhr.readyState == 4 && xhr.status == 200) { //si requete terminée et ok
						data= JSON.parse(xhr.responseText);//transformation de la chaine en JSON
						graph();
					}
					};
}
			
function graph() {
			 
	 if(charge == 1)
	 {
	 	d3.select('svg').remove();
	 }
				 

	 var data2 = [];
	 var data3 = [];

	 for(var i in data)
	 {
	 	data2.push(data[i].value);
	 	data3.push(data[i].title);
	 }
		 
	 var ratio = d3.min(data2)/d3.max(data2);
			
	 charge = 1;

	var chart =  d3.select("#resultat").append("svg") //création du svg
                                            .attr("class", "chart")//ajout à la classe chart
                                            .attr("height", 200);//réglage de la largeur, 20px par bande * data.length pour connaitre le nombre de data donc de bande
	if(ratio > 0,4)
	{
		var x = d3.scale.linear()
	  	  	  .domain([0, d3.max(data2)])
    		  	  .range([10, 50]);
    	}
  	else 
    	{
    		x = d3.scale.linear()
	       	  	    .domain([0, d3.max(data2)])
    		       	    .range([0, 50]);
    	}
    			
    				  
    	chart.selectAll("circle").data(data2) //ajout d'autant de rect qu'il y a de données
   	 	       	         .enter().append("circle")
    					 .attr("cx", function(d,i) {return 50+(i* 105); })
    					 .attr("cy", 50)
     					 .attr("r", x);
     					 
     					       	       
     	if(ratio > 0,4)
     	{
     		var y = d3.scale.ordinal()
			       	.domain(data2)
		         	.rangeBands([0, 50]);
	}
	else
	{
		var y = d3.scale.ordinal()
		          .domain(data2)
			  .rangeBands([10,50]);
	}
				
     	chart.selectAll("text")
     	     .data(data2)
   	     .enter().append("text")
     	    	     .attr("x", function(d,o) { return (50+(o * 105)); })
     	     	     .attr("y", function(d) {return x(d)+60;})
     	     	     .attr("text-anchor", "middle")
     	     	     .text(function(d, i) { return data3[i]+':'+' '+d; });
     			
}
			
function affiche(){

	var jsDate1 = parse_date(date1);
	var jsDate2 = parse_date(date2);

	var diff = diffdate(jsDate1, jsDate2);
	
	 var curseur= d3.select("#curseur").append("svg")
                                          .attr("class", "chart")
                                          .attr("height", 60)
                                          .attr("width", 400);
		
	curseur.append("line")
	       .attr("x1", 10)
	       .attr("x2", 400)
	       .attr("y1", 30)
	       .attr("y2", 30)
	       .style("stroke", "black")
	       .style("stroke-width", 4);
	curseur.append("rect")
	       .attr("width", 10)
	       .attr("height", 20)
	       .attr("x", 10)	
	       .attr("y",8)
	       .attr("id","x1Date")
	       .style("fill","grey" )
	       .on("mousedown", function (){id=this; animation = true; animate;});
	curseur.append("rect")
	       .attr("width", 10)
	       .attr("height", 20)
	       .attr("x", 390)
	       .attr("y",8)
	       .style("fill","grey" )
	       .attr("id","x2Date")
	       .on("mousedown", function (){id=this; animation = true; animate;});

	curseur.append("rect")
       	       .attr("width",ecartDate())
       	       .attr("height",18)
       	       .attr("x", posX1Date()+10)
       	       .attr("y", 10)
       	       .attr("id","zoneDate")
       	       .style("opacity", 0.7);
	       
       d3.select("body").on("mousemove", animate)
       			.on("mouseup", function(){animation = false;});
}
	
function ecartDate(){
	var ecart = parseInt(d3.select("#x2Date").attr("x")) - (parseInt(d3.select("#x1Date").attr("x"))+10);
	if(ecart < 0)
	{
		d3.select("#x2Date").attr("id","tmp");
		d3.select("#x1Date").attr("id","x2Date");
		d3.select("#tmp").attr("id","x1Date");
	}
	ecart = parseInt(d3.select("#x2Date").attr("x")) - (parseInt(d3.select("#x1Date").attr("x"))+10);
	
	return ecart;
		
}
		
function posX1Date(){
   return parseInt(d3.select("#x1Date").attr("x"));
}
		
function animate(){
			
	if(animation)
	{	
		var posX = event.clientX-parseInt(d3.select("#curseur").style("margin-left"))-7;
		if(posX > 10 && posX < 390)
		{
			d3.select(id).attr("x", posX);
		}
		else if(posX < 10)
		{
			d3.select(id).attr("x", 10);
		}
		else
		{
			d3.select(id).attr("x", 390);
		}
		color(id);
	}
	
} 

function color(id)
{
	xClick = parseInt(d3.select(id).attr("x"));
	x1Date = parseInt(d3.select("#x1Date").attr("x"));
	x2Date = parseInt(d3.select("#x2Date").attr("x"));
	if(xClick == x1Date || xClick == x2Date)
	{
		d3.select("#zoneDate").attr("x", posX1Date()+10)
				      .attr("width", ecartDate());
	}
}
	
function diffdate(d1, d2) {
	var WNbJours = d2.getTime() - d1.getTime();
	return Math.ceil(WNbJours/(1000*60*60*24));
}
		
	
	
function parse_date(string) {  
	var date = new Date();  
	var parts = String(string).split(/[- :]/);  

	date.setFullYear(parts[0]);  
	date.setMonth(parts[1] - 1);  
    	date.setDate(parts[2]);  
    	date.setHours(parts[3]);  
    	date.setMinutes(parts[4]);  
    	date.setSeconds(parts[5]);  
    	date.setMilliseconds(0);  
	return date;  
}	