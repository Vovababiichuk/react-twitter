class Post {
   static #list = []
   static #count = 1

   constructor(username, text) {
      this.id = Post.#count++
      this.username = username
      this.text = text
      this.date = new Date().getTime()

      //! буде містити пости коментарі
      this.reply = []
   }

   //! post - це не обовязковий параметр. Він використовується тоді коли ми створюємо новий пост в масив replay до іншого поста.
   static create(username, text, post) {
      const newPost = new Post(username, text)

      if (post) {
         post.reply.push(newPost)

         console.log(post);
      } else {
         this.#list.push(newPost)
      }

      console.log(this.#list);

      return newPost
   }

   //! Метод getById(id) призначений для пошуку об'єкта класу Post за його id у масиві #list. getById(id) шукає об'єкт Post з вказаним id у масиві #list і повертає його, або null, якщо об'єкт не знайдено.
   static getById(id) {
      return (
         this.#list.find((item) => item.id === Number(id)) || null
      )
   }

   static getList = () => this.#list
}

module.exports = {
   Post,
}


