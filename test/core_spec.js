import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {
  describe('setEntries', () => {
    it('add record to state', () => {
      const state = Map();
      const entries = List.of('Trainspotting', '28 Days Later');
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({entries: List.of('Trainspotting', '28 Days Later')}));
    });

    it('transform to immutable', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({entries: List.of('Trainspotting', '28 Days Later')}));
    });
  });

  describe('next', () => {
    it('get 2 first entries', () => {
      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
              pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List.of('Sunshine')
      }));
    });

    it('should push winner to end of list', () => {
       const state = Map({
         vote: Map({
           pair: List.of('Trainspotting', '28 Days Later'),
           tally: Map({
               'Trainspotting': 4,
               '28 Days Later': 2
           })
         }),
         entries: List.of('Sunshine', 'Millions', '127 Hours')
       });
       const nextState = next(state);

       expect(nextState).to.equal(Map({
         vote: Map({
             pair: List.of('Sunshine', 'Millions')
         }),
         entries: List.of('127 Hours', 'Trainspotting')
       }));
     });

    it('shoul push both to end of list if draw', () => {
     const state = Map({
       vote: Map({
         pair: List.of('Trainspotting', '28 Days Later'),
         tally: Map({
           'Trainspotting': 3,
           '28 Days Later': 3
         })
       }),
       entries: List.of('Sunshine', 'Millions', '127 Hours')
     });
     const nextState = next(state);

     expect(nextState).to.equal(Map({
       vote: Map({
         pair: List.of('Sunshine', 'Millions')
       }),
       entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
     }));
    });

      it('should marked as winner, if there was one record', () => {
        const state = Map({
          vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List()
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        winner: 'Trainspotting'
      }));
    });
  });

  describe('vote', () => {
    it('should create result of vote for selected entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later')
      });
      const nextState = vote(state, 'Trainspotting');

      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 1
        })
      }));
    });

    it('should added result of vote for selected entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        })
      });
       const nextState = vote(state, 'Trainspotting');

      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 4,
          '28 Days Later': 2
        })
      }));
     });

  });
});