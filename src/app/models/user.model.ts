import { Book } from "./book.model"

export class User {
  id: string
  username: string
  name: string
  email: string
  password: string
  cart: Book[]
  isAdmin: boolean

  constructor(id: string, username: string, name: string, email: string, password: string, cart: Book[], isAdmin: boolean) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.email = email;
    this.password = password
    this.cart = cart
    this.isAdmin = isAdmin;
  }
}
