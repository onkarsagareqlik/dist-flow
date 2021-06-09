import chai from 'chai';
import sinon from 'sinon';
import DependentInteractions from '../../dependent-interactions';

const expect = chai.expect;
const sandbox = sinon.createSandbox();
describe('Area range gesture', () => {
  const scrollApi = {
    on(/* s, callback */) {},
    move: sandbox.spy(),
  };
  const scrollHandler = {
    getScrollApi() {
      return scrollApi;
    },
    getItemSize() {
      return 1;
    },
    isOn() {
      return true;
    },
  };

  afterEach(() => {
    sandbox.reset();
  });

  const selectionHandler = {
    pauseEngineCalls() {},
    resumeEngineCalls() {},
    addComponent() {},
    isOn() {
      return true;
    },
  };

  const handlers = {
    scrollHandler,
    selectionHandler,
  };

  const keys = {
    componentKey: 'MYMARKER',
    lassoBrushKey: 'MYMARKER',
    dimRangeBrushKey: null,
    measureRangeBrushKey: 'MYMARKER',
    areaBrushKey: 'AREAMARKER',
  };

  const rangeSelStatus = {
    isOpenDim: true,
    isOpenMea: true,
  };

  describe('Setting up components', () => {
    let gestures;
    const emitter = {
      emit: sandbox.spy(),
      settings: {
        key: '',
      },
    };
    const that = {
      chart: {
        component() {
          return emitter;
        },
        componentsFromPoint() {
          return [emitter];
        },
        brush(context) {
          return {
            clear() {
              context = ''; // eslint-disable-line no-param-reassign
              return context;
            },
          };
        },
      },
    };
    const event = {
      x: 0,
      y: 0,
      center: {
        x: 0,
        y: 0,
      },
      pointers: [
        {
          clientX: 0,
          clientY: 0,
        },
      ],
    };
    let interactions;
    let rangeArea;

    beforeEach(() => {
      interactions = DependentInteractions.create(handlers, 'vertical', false, keys, rangeSelStatus);
      gestures = interactions.gestures;
      rangeArea = gestures[4];

      emitter.settings.key = 'x-axis';
      rangeArea.options.enable.call(event);
    });

    it('should not trigger a move if start has not been called first', () => {
      rangeArea.events.arearangemove.call(that, event);
      expect(emitter.emit.callCount).to.equal(0);
    });

    it('should not trigger an end if start has not been called first', () => {
      rangeArea.events.arearangeend.call(that, event);
      expect(emitter.emit.callCount).to.equal(0);
    });

    it('should not trigger a cancel if start has not been called first', () => {
      rangeArea.events.arearangecancel.call(that, event);
      expect(emitter.emit.callCount).to.equal(0);
    });

    it('should not trigger a move followed by end if start has not been called first', () => {
      rangeArea.events.arearangemove.call(that, event);
      expect(emitter.emit.callCount).to.equal(0);

      rangeArea.events.arearangeend.call(that, event);
      expect(emitter.emit.callCount).to.equal(0);
    });

    it('should trigger a move if start has been called first', () => {
      rangeArea.events.arearangestart.call(that, event);
      rangeArea.events.arearangemove.call(that, event);

      expect(emitter.emit.callCount).to.equal(2);
    });

    it('should trigger a end if start has been called first', () => {
      rangeArea.events.arearangestart.call(that, event);
      rangeArea.events.arearangeend.call(that, event);

      expect(emitter.emit.callCount).to.equal(2);
    });

    it('should trigger a move followed by end if start has been called first', () => {
      rangeArea.events.arearangestart.call(that, event);
      rangeArea.events.arearangemove.call(that, event);
      rangeArea.events.arearangeend.call(that, event);

      expect(emitter.emit.callCount).to.equal(3);
    });
  });
});
