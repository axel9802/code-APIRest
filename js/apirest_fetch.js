const d = document,
$table = d.querySelector(".crud-table"),
$form = d.querySelector(".crud-form"),
$title = d.querySelector(".crud-title"),
$template = d.getElementById("crud-template").content,
$fragment = d.createDocumentFragment();

const getAll = async () => {
    try {
        let resp = await fetch("http://localhost:3000/santos"),
        json = await resp.json();
      //  console.log(resp, json);

        if (!resp.ok) throw {status: resp.status, statusText: resp.statusText}; //lanzo un objeto con status y statusText al catch. THROW SIEMPRE LANZA AL CATCH
   
        json.forEach(element => {
            $template.querySelector(".name").textContent = element.nombre;
            $template.querySelector(".constellation").textContent = element.constelacion;
            
            $template.querySelector(".edit").dataset.id = element.id;  //Para acceder a los data attributes se pone dataset. luego va el nombre del nuevo data attribute
            $template.querySelector(".edit").dataset.name = element.nombre;
            $template.querySelector(".edit").dataset.constellation = element.constelacion;
                
            $template.querySelector(".delete").dataset.id = element.id;

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone)
        });

        $table.querySelector("tbody").appendChild($fragment);

    } catch (error) {
        let message = error.statusText || "Ocurrió un error";
            $table.insertAdjacentHTML("afterend", `<p><b>Error ${error.status}: ${message}</b></p>`);
    }
}

d.addEventListener("DOMContentLoaded", getAll);

d.addEventListener("submit", async e => {
    if (e.target === $form) {
         //Prevenir el comportamiento por defecto que tiene el envío del formulario que es detener la ejecución porque será a través de ajax
        e.preventDefault();

        //Si el elemento id está vacío osea no ha sido creado
        if(!e.target.id.value){
            //POST - CREATE
           try {
               let options = {
                   method: "POST",
                   headers: {
                    "Content-Type": "application/json; charset=utf-8"
                   },
                   body: JSON.stringify({
                    //De db.json     //De name en el html  
                    nombre: e.target.nombre.value,
                    constelacion: e.target.constelacion.value
                   })
               },
               resp = await fetch("http://localhost:3000/santos", options),
               json = await resp.json();
               
               if (!resp.ok) throw {status: resp.status, statusText: resp.statusText}; //lanzo un objeto con status y statusText al catch. THROW SIEMPRE LANZA AL CATCH
               
               location.reload();

           } catch (error) {
            let message = error.statusText || "Ocurrió un error";
            $form.insertAdjacentHTML("afterend", `<p><b>Error ${error.status}: ${message}</b></p>`);
           }
        }else {
            //PUT - UPDATE
            try {
                let options = {
                    method: "PUT",
                    headers: {
                     "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                     //De db.json     //De name en el html  
                     nombre: e.target.nombre.value,
                     constelacion: e.target.constelacion.value
                    })
                },
                resp = await fetch(`http://localhost:3000/santos/${e.target.id.value}`, options),
                json = await resp.json();
                
                if (!resp.ok) throw {status: resp.status, statusText: resp.statusText}; //lanzo un objeto con status y statusText al catch. THROW SIEMPRE LANZA AL CATCH
                
                location.reload();
    
            } catch (error) {
             let message = error.statusText || "Ocurrió un error";
             $form.insertAdjacentHTML("afterend", `<p><b>Error ${error.status}: ${message}</b></p>`);
            }
            
        }
    }
})

d.addEventListener("click", async e => {
    //Si el objeto que origina el evento es un boton con clase .edit. Ahora el e.target es el boton
    if (e.target.matches(".edit")) {
        $title.textContent = "Editar Santo";
        $form.nombre.value = e.target.dataset.name; //En los inputs poner los valores del data attribute del boton
        $form.constelacion.value = e.target.dataset.constellation;
        $form.id.value = e.target.dataset.id;
    }

    if (e.target.matches(".delete")) {
        let isDelete = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`);
        if (isDelete) {
            //DELETE - DELETE
            try {
                let options = {
                    method: "DELETE",
                    headers: {
                     "Content-Type": "application/json; charset=utf-8"
                    },
                },
                resp = await fetch(`http://localhost:3000/santos/${e.target.dataset.id}`, options),
                json = await resp.json();
                
                if (!resp.ok) throw {status: resp.status, statusText: resp.statusText}; //lanzo un objeto con status y statusText al catch. THROW SIEMPRE LANZA AL CATCH
                
                location.reload();
    
            } catch (error) {
             let message = error.statusText || "Ocurrió un error";
             alert(`Error ${error.status}: ${message}`);
            }
        }
    }
});