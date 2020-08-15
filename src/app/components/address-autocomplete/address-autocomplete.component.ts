import {
  Component,
  ViewChild,
  EventEmitter,
  Output,
  OnInit,
  AfterViewInit,
  Input,
  ElementRef,
  NgZone,
} from '@angular/core';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-address-autocomplete',
  templateUrl: './address-autocomplete.component.html',
  styleUrls: ['./address-autocomplete.component.css'],
})
export class AddressAutocompleteComponent implements OnInit, AfterViewInit {
  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('search')
  public searchElementRef: ElementRef;

  autocomplete: any;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  private getPlaceAutocomplete() {
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          componentRestrictions: {
            country: 'CA',
          },
          types: [this.adressType], // 'establishment' / 'address' / 'geocode'
        }
      );
      this.autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = this.autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.invokeEvent(place);
        });
      });
    });
  }

  invokeEvent(place: Object) {
    this.setAddress.emit(place);
  }

  onChange(event): void {
    // event will give you full breif of action
    this.autocomplete.setComponentRestrictions({
      country: this.formatCountry(event.target.value),
    });
  }

  formatCountry(country: string): string {
    if (country == 'Canada') {
      return 'CA';
    } else {
      return country;
    }
  }
}
