const db = require('./database/models');

const axios = require('axios');
const defaults = require('./requests/defaults');
//const defaults = require('./requests/defaults');

// const booksRequest = {
//     getBooksByCategory : function(category){
//         return axios({
//             baseUrl: "https://google-books-api.herokuapp.com",
//             timeout: 4000,
//             method: 'GET',
//             url: "/books",
//             params: {
//                 query: category,
//                 limit: 1
//             }
//         })
//     }
// }


const booksRequest = {
    getBooksByCategory : function(category){
        return axios.get(`https://google-books-api.herokuapp.com/books?query=${category.title}&limit=50`)
    }
}

const saveBooks = function(books, categoryId) {
    books.forEach(data => {
        let book = data.book_information;
        let idAuthor = 0;
        db.Authors.findAll()
        .then(function(authors){
            authors.forEach(author => {
                
                if (author.name == book.authors[0]){
                    idAuthor = author.id;                    
                }                                     
            })
            if (idAuthor == 0){
                db.Authors.create({
                    name: book.authors[0],
                    bioAuthor: book.authors[0] + ' es profesor y licenciado en Historia; guionista y escritor. Toda su obra está publicada en Alfaguara: los libros de relatos Esperándolo a Tito; Te conozco; Mendizábal; Lo raro empezó después; Un viejo que se pone de pie; Los dueños del mundo y La vida que pensamos; las novelas La pregunta de sus ojos; Aráoz y la verdad; Papeles en el viento; Ser feliz era esto y La noche de la Usina (Premio Alfaguara de novela 2016); y las antologías Las llaves del reino y El fútbol; de la mano; que reúnen sus artículos publicados en la revista El Gráfico (2011-2015). La pregunta de sus ojos fue llevada al cine por Juan José Campanella como El secreto de sus ojos; film distinguido con el Oscar a la mejor película extranjera (2010) y cuyo guión estuvo a cargo de Sacheri y Campanella. Aráoz y la verdad fue adaptada al teatro. Papeles en el viento fue filmada por Juan Taratuto y La noche de la Usina tiene su versión cinematográfica con el título La odisea de los giles; dirigida por Sebastián Borensztein. Su obra ha sido traducida a más de veinte idiomas. Colabora en diarios y revistas nacionales e internacionales.',
                    image: "default-image.jpg",
                })
                .then(function(author){
                    idAuthor = author.id;
                    db.Products.create({
                        title: book.title,
                        description: book.description,
                        price: 300,
                        stock: 123,
                        isbn: 123123123,    
                        numberPages: book.pageCount,    
                        image: book.imageLinks.thumbnail,    
                        discount: 10,    
                        categoryId: categoryId,    
                        subCategoryId: 1,
                        authorId: idAuthor,
                        editorialId: 1,    
                        coverTypeId: 1,    
                        formatTypeId: 1
                    })
                    .catch(function(e){
                        console.log(e);
                    })
                })
            } else {
                db.Products.create({
                    title: book.title,
                    description: book.description,
                    price: 680,
                    stock: 123,
                    isbn: 9788432236365,    
                    numberPages: book.pageCount,    
                    image: book.imageLinks.thumbnail,    
                    discount: 10,    
                    categoryId: categoryId,    
                    subCategoryId: 1,    
                    authorId: idAuthor,
                    editorialId: 1,    
                    coverTypeId: 1,    
                    formatTypeId: 1
                })
                .catch(function(e){
                    console.log(e);
                })
            }
        })
         
             
        
    })    
}

let categories = db.Categories.findAll();

Promise.all([categories])
    .then(function([categories]){
        categories.forEach(category => {
            booksRequest.getBooksByCategory(category)
                .then(function(data){
                    saveBooks(data.data.books, category.id);                    
                })
                .catch(function(e){
                    console.log(e);
                })    
        });
    })





    