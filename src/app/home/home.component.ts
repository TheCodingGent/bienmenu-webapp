import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../restaurant';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  restaurants: Restaurant[];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.getRestaurants();
  }

  getRestaurants(): void {
    this.restaurantService
      .getRestaurants()
      .subscribe((restaurants) => (this.restaurants = restaurants));
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    console.log(name);
    // this.restaurantService.addHero({ name } as Hero).subscribe((hero) => {
    //   this.restaurants.push(hero);
    // });
  }

  // delete(hero: Hero): void {
  //   this.heroes = this.heroes.filter(h => h !== hero);
  //   this.heroService.deleteHero(hero).subscribe();
  // }
}
