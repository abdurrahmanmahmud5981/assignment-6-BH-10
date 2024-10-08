//document.getElementById("spiner").style.display = "block";
// get data for categories
const loadCategories = async () => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/peddy/categories`
  );
  const data = await response.json();
  showCategories(data.categories);
};
// Show categories
const showCategories = (categories) => {
  const categoryBtns = document.getElementById("category-btns");

  categories.forEach((categoryOfCategories) => {
    const { id, category, category_icon } = categoryOfCategories;
    const btn = document.createElement("button");

    btn.onclick = () => loadCategoryById(category, id);
    btn.id = `${id}`;
    btn.classList.add(
      "category-btn",
      "btn",
      "flex",
      "gap-3",
      "items-center",
      "justify-center",
      "bg-white",
      "shadow-sm",
      "hover:bg-slate-100",
      "py-5",
      "h-20",
      "hover:rounded-full",
      "hover:shadow-lg"
    );
    btn.innerHTML = `
        <img class="w-8 h-8" src=${category_icon} alt="${category}" />
        <span class="text-lg">${category}</span>
        `;
    categoryBtns.appendChild(btn);
  });
};

const loadCategoryById = async (category = "Cat", id = 0) => {
  document.getElementById("spiner").style.display = "block";
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/peddy/category/${category}`
    );
    const data = await response.json();

    removeActiveClass();
    const activeBtn = document.getElementById(`${id}`);
    console.log(activeBtn);
    activeBtn.classList.add("activeCategory");
    setTimeout(() => {
      showCards(data.data);
      document.getElementById("spiner").style.display = "none";
    }, 1000);
  } catch (error) {
    console.error("error", error);
  }
};
const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  for (const btn of buttons) {
    btn.classList.remove("activeCategory");
  }
};
// get data for cards
const loadCards = async (status = false) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/peddy/pets`
  );
  const data = await response.json();
  let { pets } = data;
  console.log(pets);
  if (status) {
    pets = [...pets].sort((a, b) => b.price - a.price);
    console.log(pets);
    setTimeout(() => {
      showCards(pets);
    }, 2000);
    return;
  } else {
    setTimeout(() => {
      showCards(pets);
    }, 2000);
  }
};

// Show cards
const showCards = (pets = []) => {
  const card1 = document.getElementById("card-1");
  document.getElementById("card-1").innerHTML = "";
  pets.length === 0
    ? (card1.innerHTML = `
      <div class=" py-6 text-center flex flex-col gap-4 items-center col-span-full bg-base-100">
      <img src="assets/images/error.webp" alt="error icon " />
      <h3 class=" text-2xl font-bold">No Information Available</h3>
      <p>Sorry, no pets found in this categor</p>
      </div>
    
  `)
    : pets.forEach((pet) => {
        const { petId, pet_name, image, breed, date_of_birth, gender, price } =
          pet;
        const div = document.createElement("div");
        div.className = "card bg-base-100 border";
        div.innerHTML = `
     <figure class="px-4 pt-4">
                <img
                  src="${image}"
                  alt=${pet_name}
                  class="rounded-xl w-full" />
     </figure>
      <div class="card-body py-4 px-4">
                <h2 class="card-title">${pet_name}</h2>
                <h4 class=" space-x-1 flex -ml-1 items-center text-base font-semibold  text-gray-500">
                  <img src="assets/images/breed.svg" alt="breed icon" />
                <span>
                Breed: ${breed ? breed : "Not Found"}
                </span></h4>
                <h4 class=" space-x-1 text-base font-semibold  text-gray-500"><i class="fa-regular fa-calendar"></i> 
                <span>
                Birth: ${date_of_birth ? date_of_birth : "Not Found"}</span>
                </h4>
                <h4 class="space-x-1 text-base font-semibold  text-gray-500"><i class="fa-solid fa-mercury"></i> 
                <span>
                Gender: ${gender ? gender : "Not Found"}
                </span> 
                </h4>
                <h4 class="space-x-1 text-base font-semibold  text-gray-500"> <i class="fa-solid fa-dollar-sign"></i>
                <span>
                Price: ${price ? `${price} $` : "Not Found"}
                </span> 
                </h4>
                <div class="card-actions flex border-t pt-4 lg:justify-between">
                  <button onclick="likeBtn('${image}','${pet_name}')" class="py-2 px-4 border rounded-lg ring-1 text-[#0E7A81] ring-[#0E7A81]/30 font-semibold "><i class="fa-regular fa-thumbs-up"></i></button>
                  <button onclick="adoptModel()" class="py-2 px-4 border rounded-lg ring-1 text-[#0E7A81] ring-[#0E7A81]/30 font-semibold ">Adopt</button>
                  <button onclick="showDetails(${petId})" id=${petId} class="py-2 px-4 border rounded-lg ring-1 text-[#0E7A81] ring-[#0E7A81]/30 font-semibold ">Details</button>
                </div>
            
    </div>
    `;
        card1.appendChild(div);
      });
};

// show details
const showDetails = async (petId) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
  );
  const data = await response.json();
  const {
    petData: {
      pet_name,
      breed,
      date_of_birth,
      price,
      image,
      pet_details,
      vaccinated_status,
      gender,
    },
  } = data;

  const detailContainer = document.getElementById("modal-content");
  detailContainer.innerHTML = `
    <img class="w-full object-cover rounded-lg" src=${image} alt=${pet_name} />
    <h2 class="card-title my-4  ">${pet_name}</h2>
     <div class=" flex flex-wrap gap-3">
  
      <div>
       <h4 class=" space-x-1 flex -ml-1 items-center text-base font-semibold  text-gray-500">
          <img src="assets/images/breed.svg" alt="breed icon" />
          <span>
          Breed: ${breed ? breed : "Not Found"}
          </span>
         </h4>
         <h4 class="space-x-1 text-base font-semibold  text-gray-500">
         <i class="fa-solid fa-mercury"></i> 
          <span>
          Gender: ${gender ? gender : "Not Found"}
          </span> 
          </h4>
          <h4 class="space-x-1 text-base font-semibold  text-gray-500">
            <i class="fa-solid fa-mercury"></i> 
             <span>
             Vaccinated Status: ${
               vaccinated_status ? vaccinated_status : "Not Found"
             }
             </span> 
            </h4>
      </div>

    <div>
        <h4 class=" space-x-1 text-base font-semibold  text-gray-500">
          <i class="fa-regular fa-calendar"></i> 
          <span>
          Birth: ${date_of_birth ? date_of_birth : "Not Found"}
          </span>
        </h4>
        
        <h4 class="space-x-1 text-base font-semibold  text-gray-500">
           <i class="fa-solid fa-dollar-sign"></i>
           <span>
           Price: ${price ? `${price} $` : "Not Found"}
           </span> 
        </h4>
    </div>
     </div>           
     <h3 class="text-xl pt-3 font-bold">Details Informaition</h3>
     <p>${pet_details}</p>
  `;
  // show modal
  document.getElementById("customeModal").showModal();
};

// like button operation
const likeBtn = (image, pet_name) => {
  // console.log(arguments);
  console.log(image);
  const img = document.createElement("img");
  img.className = " h-fit-content rounded-lg";
  img.src = image;
  img.alt = pet_name;

  document.getElementById("card-2").appendChild(img);
};

const adoptModel = () => {
  console.log("adopt modal");
  const adoptContent = document.getElementById("adopt-content");
  let i = 2;
  const int = setInterval(function () {
    console.log("JavaScript World");
    adoptContent.innerHTML = `
      ${i}
      `;
    i--;
    console.log(i);
    if (i === 0) {
      document.getElementById("adoptModal").close();
      clearInterval(int);
    }
  }, 1000);
  adoptContent.innerHTML = `3`;
  //  document.getElementById("customeModal").close();
  document.getElementById("adoptModal").showModal();
};

document.getElementById("sortBtn").addEventListener("click", () => {
  document.getElementById("spiner").style.display = "block";

  setTimeout(() => {
    document.getElementById("spiner").style.display = "none";

    loadCards(true);
  }, 1000);
});

loadCategories();

loadCards();
