const API = 'http://localhost:8000/products';

//! Modal Add
let productName = $('#productName');
let productPrice = $('#productPrice');
let productDescription = $('#productDescription');
let productImage = $('#productImage');
let btnSave = $('.btn-save');
let modal = $('.modal');

// ! list where we render cards
let list = $('.list');

//! Modal Edit
let productNameEdit = $('#productName-edit');
let productPriceEdit = $('#productPrice-edit');
let productDescriptionEdit = $('#productDescription-edit');
let productImageEdit = $('#productImage-edit');
let btnSaveEdit = $('.btn-save-edit');

//! Search
let seachInp = $('.inp-search');
let searchText = '';

// ! Pages
let pageCount = 1;
let currentPage = 1;

let prev = $('.prev');
let next = $('.next');
let pagination = $('.pagination');
let pag = $('.pag');
// ! CRUD

async function addNewProduct() {
  let product = {
    name: productName.val(),
    price: productPrice.val(),
    img: productImage.val(),
    desc: productDescription.val(),
  };
  try {
    let response = await fetch(API, {
      method: 'POST',
      body: JSON.stringify(product),
      headers: {
        'Content-type': 'application/json; charset = utf-8',
      },
    });
    modal.modal('hide'); // закрыть модалку после добавления
    render();
    productName.val('');
    productPrice.val('');
    productImage.val('');
    productDescription.val('');
  } catch (error) {
    console.log(error);
  }
}

btnSave.on('click', addNewProduct);

// ! Отображение товара на странице

// * RENDER
async function render() {
  let res = await fetch(`${API}?q=${searchText}&_limit=3&_page=${currentPage}`);
  let data = await res.json();
  list.html('');
  data.forEach((product) => {
    list.append(createCardHtml(product));
  });
  getAllProducts();
}

render();
// ! функция которая создает карточку

function createCardHtml(product) {
  return `
        <div class="card mt-3 mb-3 mx-4" style="width: 18rem;">
            <img style="width: 100%; object-fit: contain; height: 190px" src=${product.img} class="card-img-top" alt="...">
            <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.desc}</p>
            <h6 class="card-title">Price: $${product.price}</h6>
            <button
                id=${product.id}
                type="button"
                class="btn btn-primary edit-btn"
                data-bs-toggle="modal"
                data-bs-target="#editModal"
            >
                Edit
            </button>
            <button
                id=${product.id}
                type="button"
                class="btn btn-danger del-btn"
            >
                Delete
            </button>
            </div>
        </div>
    `;
}

// ! удаление продукта

async function deleteProduct(id) {
  try {
    let res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
    });
    render();
  } catch (error) {
    console.log(error);
  }
}

$('body').on('click', '.del-btn', (e) => {
  let idToDelete = e.target.id;
  console.log(idToDelete);
  deleteProduct(idToDelete);
});

// ! Редактирование продукта

async function getOneProductToEdit(id) {
  try {
    let res = await fetch(`${API}/${id}`);
    let data = await res.json();
    productNameEdit.val(data.name);
    productPriceEdit.val(data.price);
    productImageEdit.val(data.img);
    productDescriptionEdit.val(data.desc);
  } catch (error) {
    console.log(error);
  }
}

$('body').on('click', '.edit-btn', (e) => {
  let idToEdit = e.target.id;
  getOneProductToEdit(idToEdit);
  btnSaveEdit.attr('id', idToEdit);
});

// ! Сохранить изменение товара

async function saveEditedProduct(idToSave) {
  let editProduct = {
    name: productNameEdit.val(),
    price: productPriceEdit.val(),
    img: productImageEdit.val(),
    desc: productDescriptionEdit.val(),
  };
  try {
    let res = await fetch(`${API}/${idToSave}`, {
      method: 'PATCH',
      body: JSON.stringify(editProduct),
      headers: {
        'Content-Type': 'application/json; charset = utf-8',
      },
    });
    render();
    modal.modal('hide');
  } catch (error) {
    console.log(error);
  }
}

btnSaveEdit.on('click', (e) => {
  let idToSave = e.target.id;
  saveEditedProduct(idToSave);
});

// ! Search

seachInp.on('input', (e) => {
  searchText = e.target.value;
  console.log(e.target.value);
  render();
});

// ! Pagination

async function getAllProducts() {
  try {
    let res = await fetch(`${API}?q=${searchText}`);
    let data = await res.json();
    // console.log(data);
    pageCount = Math.ceil(data.length / 3);
    // console.log(pageCount);
    pag.html('');
    for (let i = pageCount; i >= 1; i--) {
      if (i == currentPage) {
        pag.append(`
      <li class="page-item active">
        <a class="page-link page_number" href="#">${i}</a>
      </li>
      `);
      } else {
        pag.append(`
        <li class="page-item">
        <a class="page-link page_number" href="#">${i}</a>
      </li>
        `);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

next.on('click', () => {
  if (currentPage >= pageCount) {
    return;
  }
  currentPage++;
  render();
});

prev.on('click', () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

$('body').on('click', '.page_number', (e) => {
  currentPage = e.target.innerText;
  render();
});

// ! показать видео

$('video-link').on('click', (e) => {
  pag.append(`<iframe width="560" height="315" src="https://www.youtube.com/embed/mpOJUaxyyX4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
})