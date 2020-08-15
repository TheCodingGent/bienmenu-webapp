function getAddrComponent(place, componentTemplate) {
  let result;

  for (let i = 0; i < place.address_components.length; i++) {
    const addressType = place.address_components[i].types[0];
    if (componentTemplate[addressType]) {
      result = place.address_components[i][componentTemplate[addressType]];
      return result;
    }
  }
  return;
}

export function getFormattedAddress(place: object) {
  return place['formatted_address'];
}

export function getStreetNumber(place: object) {
  const COMPONENT_TEMPLATE = { street_number: 'short_name' },
    streetNumber = getAddrComponent(place, COMPONENT_TEMPLATE);
  return streetNumber;
}

export function getStreet(place: object) {
  const COMPONENT_TEMPLATE = { route: 'long_name' },
    street = getAddrComponent(place, COMPONENT_TEMPLATE);
  return street;
}

export function getCity(place: object) {
  const COMPONENT_TEMPLATE = { locality: 'long_name' },
    city = getAddrComponent(place, COMPONENT_TEMPLATE);
  return city;
}

export function getState(place: object) {
  const COMPONENT_TEMPLATE = { administrative_area_level_1: 'short_name' },
    state = getAddrComponent(place, COMPONENT_TEMPLATE);
  return state;
}

export function getDistrict(place: object) {
  const COMPONENT_TEMPLATE = { administrative_area_level_2: 'short_name' },
    state = getAddrComponent(place, COMPONENT_TEMPLATE);
  return state;
}

export function getCountryShort(place: object) {
  const COMPONENT_TEMPLATE = { country: 'short_name' },
    countryShort = getAddrComponent(place, COMPONENT_TEMPLATE);
  return countryShort;
}

export function getCountry(place: object) {
  const COMPONENT_TEMPLATE = { country: 'long_name' },
    country = getAddrComponent(place, COMPONENT_TEMPLATE);
  return country;
}

export function getPostCode(place: object) {
  const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
    postCode = getAddrComponent(place, COMPONENT_TEMPLATE);
  return postCode;
}

export function getPhone(place: object) {
  return place['formatted_phone_number'];
}
