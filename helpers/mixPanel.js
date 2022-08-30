const mixpanelKey = process.env.NEXT_PUBLIC_MIXPANEL_CLIENT_KEY;
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

import mixpanel from "mixpanel-browser";
mixpanel.init(mixpanelKey);

const actions = {
  identify: (id) => {
    mixpanel.identify(id);
  },
  track: (name, props) => {
    mixpanel.track(name, { ...props, environment });
  },
  people: {
    set: (props) => {
      mixpanel.people.set({ ...props, environment });
    },
    increment: (props) => {
      mixpanel.people.increment(props);
    },
  },
};

export const Mixpanel = actions;
