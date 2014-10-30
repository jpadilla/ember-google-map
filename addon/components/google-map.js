/* globals google */
import Ember from 'ember';
import helpers from '../core/helpers';
import GoogleObjectMixin from '../mixins/google-object';


function obj(o) {
  return Ember.Object.create(o);
}

export var MAP_TYPES = Ember.A([
  obj({ id: 'road', label: 'road'}),
  obj({ id: 'satellite', label: 'satellite'}),
  obj({ id: 'terrain', label: 'terrain'}),
  obj({ id: 'hybrid', label: 'hybrid'})
]);

export var PLACE_TYPES = Ember.A([
  obj({ id: helpers.PLACE_TYPE_ADDRESS, label: 'address' }),
  obj({ id: helpers.PLACE_TYPE_LOCALITY, label: 'locality' }),
  obj({ id: helpers.PLACE_TYPE_ADMIN_REGION, label: 'administrative region' }),
  obj({ id: helpers.PLACE_TYPE_BUSINESS, label: 'business' })
]);

var GoogleMapComponent = Ember.Component.extend(GoogleObjectMixin, {
  classNames: ['google-map'],

  googleProperties: {
    zoom:      { event: 'zoom_changed', cast: helpers.cast.integer },
    type:      {
      name:       'mapTypeId',
      event:      'maptypeid_changed',
      toGoogle:   helpers._typeToGoogle,
      fromGoogle: helpers._typeFromGoogle
    },
    'lat,lng': {
      name:       'center',
      event:      'center_changed',
      toGoogle:   helpers._latLngToGoogle,
      fromGoogle: helpers._latLngFromGoogle
    }
  },

  /**
   * @property googleObject
   * @type google.maps.Map
   * @private
   */
  googleObject: null,
  /**
   * @property lat
   * @type Number
   */
  lat:          0,
  /**
   * @property lng
   * @type Number
   */
  lng:          0,
  /**
   * @property zoom
   * @type Number
   * @default 5
   */
  zoom:         5,

  /**
   * @property type
   * @type String
   * @enum ['road', 'hybrid', 'terrain', 'satellite']
   * @default 'road'
   */
  type: 'road',

  markers:                      null,
  markerController:             'google-map/marker',
  //FIXME: ember does not allow to set itemView neither itemViewClass bound on that!
  markerViewClass:              'google-map/marker',
  markerInfoWindowTemplateName: 'google-map/info-window',
  markerHasInfoWindow:          true,

  infoWindows:            null,
  infoWindowController:   'google-map/info-window',
  //FIXME: ember does not allow to set itemView neither itemViewClass bound on that!
  infoWindowViewClass:    'google-map/info-window',
  infoWindowTemplateName: 'google-map/info-window',

  map: Ember.computed.oneWay('googleObject'),

  initGoogleMap: function () {
    var canvas, opt, map;
    this.destroyGoogleMap();
    if (helpers.hasGoogleLib()) {
      canvas = this.$('div.map-canvas')[0];
      opt = this.serializeGoogleOptions();
      Ember.debug('[google-map] creating map with options: %@'.fmt(opt));
      map = new google.maps.Map(canvas, opt);
      this.set('googleObject', map);
      this.synchronizeEmberObject();
    }
  }.on('didInsertElement'),

  destroyGoogleMap: function () {
    if (this.get('googleObject')) {
      Ember.debug('[google-map] destroying map');
      this.set('googleObject', null);
    }
  }.on('willDestroyElement')
});

export default GoogleMapComponent;
