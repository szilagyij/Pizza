document.getElementById('ujszallas').addEventListener('click', () => {
    let container = document.getElementById('container');
    container.innerHTML = ''; 

    const createFormGroup = (labelText, inputType, inputId) => {
        const div = document.createElement("div");
        div.className = "form-group";
    
        const label = document.createElement("label");
        label.innerText = labelText;
        label.htmlFor = inputId; // label is associated with the input via 'for' attribute
        div.appendChild(label);
    
        const input = document.createElement("input");
        input.type = inputType;
        input.id = inputId; // setting the id attribute
        div.appendChild(input);
    
        return div;
    };
    

    container.appendChild(createFormGroup("Név", "text", "host_name"));
    container.appendChild(createFormGroup("Hány éjszaka?", "text", "minimum_nights"));
    container.appendChild(createFormGroup("Helyszín","text","location"))
    container.appendChild(createFormGroup("Ára /éjszaka? PL.:'10000'", "number", "price"));
    

    let btn=document.createElement("button")
    btn.innerText="Mentés"
    btn.setAttribute("id","save")
    container.appendChild(btn)


    document.getElementById("save").onclick = function() {
       let hostname= document.getElementById(`host_name`).value
       let minnight=document.getElementById(`minimum_nights`).value
       let megadlocation=document.getElementById(`location`).value
       let megadprice=document.getElementById(`price`).value
        if (hostname=="" || minnight=="" || megadlocation=="" ||megadprice=="") {
            alert("Mindent ki kell tölteni!")
        } 
        else
        {
            let bodyForPost = JSON.stringify({ 
                hostname: document.getElementById("host_name").value,
                location: document.getElementById("location").value,
                minimum_nights: document.getElementById("minimum_nights").value,
                name: document.getElementById("host_name").value,
                price: Number(document.getElementById("price").value)
            })
        

    

    fetch("https://www.nodejs.sulla.hu/data", {
        method: "POST",
        body: bodyForPost,
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(function() {
        location.reload()
    }).catch(error => {
        console.error('Hiba történt a kérés során:', error);
        alert('Hiba történt az adatok lekérése közben.');
    });
    }
}




});



document.getElementById('szallasok').addEventListener('click', () => {
    let container = document.getElementById('container');
    fetch("https://nodejs.sulla.hu/data")
    .then(function(datas) {
        return datas.json(); 
    })
    .then(function(datas) {
        console.log(datas);
        let contentHTML = '<div class="cards-wrapper">'; // Külső div kezdete
        for (let i = 0; i < datas.length; i++) {
            contentHTML += `<div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${datas[i].name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted feher">${datas[i].location}</h6>
                    <button class="button" onClick="Delete(${datas[i].id})">Töröl</button>
                    <button class="button" onClick="Edit(${datas[i].id})">Módosítás</button>
                    <button class="button" onClick="More(${datas[i].id})">Részletek</button>
                </div>
            </div>`;
        }
        contentHTML += '</div>'; // Külső div vége
        container.innerHTML = contentHTML;
    }).catch(error => {
        console.error('Hiba történt a kérés során:', error);
        alert('Hiba történt az adatok lekérése közben.');
    });
});

function Edit(id){
   let szerkeszt= document.getElementById(`edit`)
   szerkeszt.style.display = 'block';
   console.log(szerkeszt.style.display)
    document.getElementById(`Modositfinal`).addEventListener('click',()=>{
        let bodyforput=JSON.stringify({
            id:Number(id),
            name:document.getElementById(`megadnev`).value,
            hostname:document.getElementById(`megadhostname`).value,
            location:document.getElementById(`megadlocation`).value,
            price:document.getElementById(`megadprice`).value
        })
      
        // PUT-hoz kell az id az url végére
        fetch("https://nodejs.sulla.hu/data/"+id, {
          method: "PUT",
          body: bodyforput,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(function(){
            location.reload()
        });
    })
    document.getElementById(`Modositback`).addEventListener('click',()=>{
        document.getElementById('edit').style.display = 'none';
    })

    
  }


function Delete(id){
    if (confirm("Biztos törlöd?")) {
        fetch("https://nodejs.sulla.hu/data/"+id,{
            method:"DELETE",
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(function(){
            location.reload()
        })
    }
}


function More(id) {
    fetch(`https://www.nodejs.sulla.hu/data/${id}`)
    .then(function(datas) {
        return datas.json();
    })
    .then(function(data) {
        let popup = document.getElementById('popup');
        popup.style.display = 'block';
        document.getElementById('pname').innerText =`Szállás neve:${data.name}`;
        document.getElementById('plocation').innerText =`Szállás Helyszíne:${data.location}`;
        document.getElementById('phostname').innerText = `Szállás elérhetősége:${data.hostname}`;
        document.getElementById('pprice').innerText = `Szállás ára:${data.price} Ft/Éj`;
    }).catch(error => {
        console.error('Hiba történt a kérés során:', error);
        alert('Hiba történt az adatok lekérése közben.');
    });
};

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function main(){
    let container=document.getElementById(`container`)
    container.innerHTML=`  
    <h1>Szia! üdvözöllek!</h1>
        <p>Üdvözöljük a DreamStay-n! Itt minden a tökéletes szállás megtalálásáról szól, legyen szó egy csendes vidéki menedékről, egy tengerparti villáról vagy egy városi apartmanról. Fedezze fel szálláshelyeink széles választékát és tervezze meg következő kikapcsolódását velünk! Foglaljon könnyedén, biztonságosan és élvezze előnyeinket. Várjuk, hogy üdvözölhessük Önt a világ bármely pontján!</p>
       `
}

document.getElementById(`kezdo`).addEventListener('click',()=>{
    main();
})

main();

/*

 Szállások menüpontban lesz a szállások kilistázása, mindegyik szálláson jelenjen meg "Törlés", "Részletek" és "Módosítás" gomb (lehet iconokkal is megoldani)


GET kérés:
https://nodejs.sulla.hu/data

GET id kérés:
https://nodejs.sulla.hu/data/ + id

POST kérés:
https://nodejs.sulla.hu/data

DELETE kérés:
https://nodejs.sulla.hu/data/ + id

PUT kérés:
https://nodejs.sulla.hu/data/ + id
*/