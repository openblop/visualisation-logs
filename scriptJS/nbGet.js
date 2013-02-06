/*
/ Variables nécessaires au fonctionnement général du script
*/
var data;
var charge = 0;
var date1, date2;
var acces = new Array;
var tranches_horaires = new Array;

function update()//fonction appelée lors du click sur valider
{
		initTranches(); //Initialisation du tableau de tranches horaires, nécessaire pour le svg en graphique
		
        var xhr = new XMLHttpRequest();//création de la requête
        date1 = document.getElementById('date1').value;
        date2 = document.getElementById('date2').value;
        var resultat = document.getElementById('resultat');
        date1 =encodeURIComponent(date1);
        date2 = encodeURIComponent(date2);
        
        xhr.open('GET', 'http://localhost:8888/scriptPhp/nbGet.php?date1='+date1+'&date2='+date2);//parametrage de la requête
        xhr.send(null);//envoi de la requete
        xhr.onreadystatechange = function() {
                                        		if (xhr.readyState == 4 && xhr.status == 200) { //si requete terminée et ok
                                                	data= JSON.parse(xhr.responseText);//transformation de la chaine en JSON
                                                	
                                                	//alert('1ère étape de test - premiere date enregistrée  : ' + data[0].ltime); // TEST
                                                	//alert('2ème étape de test - Taille de data : ' + data.length); // TEST
                                                	
                                                	parse_tab();
                                                	
                                                	//alert('3ème étape de test - acces entre 6h et 7h : ' + acces[6]); // TEST
                                                	//alert('4eme étape de test - taille de acces = ' + acces.length); // TEST
                                                	
                                                	percentage();
                                                	
                                                	/* TEST	
                                                	
                                                	for(var i=0 ; i < 24 ; i++)
														{
															alert(acces[i]);
														}
													*/
                                                	
                                                	//alert('5ème étape de test - valeur de acces[6] = ' + acces[6]); // TEST
                                                	
                                                	graph();
                                        		}
                                        	};
}


function initTranches()
{
	tranches_horaires[0] = '00-01';
	tranches_horaires[1] = '01-02';
	tranches_horaires[2] = '02-03';
	tranches_horaires[3] = '03-04';
	tranches_horaires[4] = '04-05';
	tranches_horaires[5] = '05-06';
	tranches_horaires[6] = '06-07';
	tranches_horaires[7] = '07-08';
	tranches_horaires[8] = '08-09';
	tranches_horaires[9] = '09-10';
	tranches_horaires[10] = '10-11';
	tranches_horaires[11] = '11-12';
	tranches_horaires[12] = '12-13';
	tranches_horaires[13] = '13-14';
	tranches_horaires[14] = '14-15';
	tranches_horaires[15] = '15-16';
	tranches_horaires[16] = '16-17';
	tranches_horaires[17] = '17-18';
	tranches_horaires[18] = '18-19';
	tranches_horaires[19] = '19-20';
	tranches_horaires[20] = '20-21';
	tranches_horaires[21] = '21-22';
	tranches_horaires[22] = '22-23';
	tranches_horaires[23] = '23-00';
}
	
//Cette Fonction permet de répartir les accès répertoriés dans un tableau de tranches horaires
function parse_tab()
{

	var comp;

	for(var i=0 ; i < 24 ; i++)
	{
		acces[i] = 0;
	}
	
	for(var i in data)
	{
		comp = parse_date(data[i].ltime)

		var hour = comp.getHours()
		acces[hour] += 1; 
	}
}


//Permet d'adapter le tableau d'horaires en pourcentage sans décimal
function percentage()
{
	var total = data.length;
	
	for(var i=0; i<acces.length ; i++)
	{	
		acces[i] = Math.round(((acces[i]*100)/total)*10)/1000;
		/*
		/exemple : si la totalité des accès ont lieu entre 6h et 7h, acces[6] vaudra 1 (100%)
		*/
	}
}


//permet de passer d'un format de date MySql à un format de date Javascript    
function parse_date(str) 
{  
        var date = new Date();  
        var tiret = 0;
        while(tiret == 0)
        {
        	var anc = str;
        	str = str.replace("%3A",':');
        	str = str.replace("%20",':');
        	if(anc == str)
        	{
        		tiret = 1;
        	}
        }

        var parts = str.split(/[- :]/);  

        date.setFullYear(parts[0] || 0);  
        date.setMonth(parts[1] || 0);  
        date.setDate(parts[2] || 0);  
        date.setHours(parts[3] || 0);  
        date.setMinutes(parts[4] || 0);  
        date.setSeconds(parts[5] || 0);  
        date.setMilliseconds(0);  
        
        return date;  
}  


                       
function graph() {
                         
    if(charge == 1)
    {
        d3.selectAll("svg").remove();
    }
                  
    var margin = {top: 20, right: 20, bottom: 30, left: 100},
   		width = 1200 - margin.left - margin.right,
    	height = 500 - margin.top - margin.bottom;

	var formatPercent = d3.format(".0%");

	var x = d3.scale.ordinal()
    	.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
    	.range([height, 0]);

	var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");

	var yAxis = d3.svg.axis()
    	.scale(y)
    	.orient("left")
    	.tickFormat(formatPercent);               

    var svg = d3.select("#resultat").append("svg") //création du svg
    	.attr("width", 1090) //largeur du svg
    	.attr("height", height + margin.top + margin.bottom) //hauteur du svg
  	.append("g")
   		.attr("transform", "translate(" + 30 + "," + margin.top + ")");    
   			
   	x.domain(tranches_horaires.map(function(d) { return d; })); //Determine toutes les valeurs qui seront présentes en abscisse sur notre graphique
  	y.domain([0, d3.max(acces)]); //Determine toutes les valeurs qui seront présentes en ordonnées sur notre graphique

  	svg.append("g")
    	.attr("class", "x axis")
      	.attr("transform", "translate(0," + height + ")")
     	.call(xAxis); // On ajoute l'axe des abscisses au svg

  	svg.append("g")
      	.attr("class", "y axis")
      	.call(yAxis) // On ajoute l'axe des ordonnées au svg
    .append("text") // On ajoute une légende à l'axe des ordonnées
    	.attr("transform", "rotate(-90)")
      	.attr("y", 6)
      	.attr("dy", ".71em")
      	.style("text-anchor", "end")
      	.text("Frequency");
     	
  	svg.selectAll(".bar")
    	.data(acces)
    .enter().append("rect")
      	.attr("class", "bar")
     	.attr("x", function(tranches_horaires, d) { return x(d); })
     	.attr("width", x.rangeBand())
      	.attr("y", function(d) { return y(d); })
      	.attr("height", function(d) { return height - y(d); })
      	      	.attr("fill", function(d) {
    		return "rgb(0, 0, " + (d * 1000) + ")";
		});
      	
      	
      	 
    //Rajoute le pourcentage dans chacune des barres 	
    /* NE FONCTIONNE PAS
 	svg.selectAll("text")
  		.data(acces)
  	.enter().append("text")
  		.attr("x", function(tranches_horaires, d) { return x(d); })
  		.attr("y", function(d) { return y(d); })
  		.attr("dx", -3)
  		.attr("dy", "1.2em")
  		.attr("text-anchor", "middle")
  		.text(function(d) { return d;})
  		.attr("fill", "black");
	*/
      	
    charge = 1;
}




















