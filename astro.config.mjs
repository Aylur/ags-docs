import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const base = '/ags-docs';

const config = [
    'Installation',
    'JavaScript',
    'First Widgets',
    'Reactivity',
    'Theming',
    'Config Object',
    'Type Checking',
    'CLI',
    'Widgets',
    'Variables',
    'Services',
    'Utils',
    'Custom Service',
    'Subclassing GTK Widgets',
    'Examples',
    'Common Issues'
];

const widgets = [
    'Window',
    'Box',
    'Button',
    'CenterBox',
    'CircularProgress',
    'Entry',
    'EventBox',
    'Icon',
    'Label',
    'Overlay',
    'ProgressBar',
    'Revealer',
    'Scrollable',
    'Slider',
    'Stack',
    'Menu',
    'MenuItem',
];

// https://astro.build/config
export default defineConfig({
    site: 'https://aylur.github.io',
    base,
    build: {
        format: 'directory',
    },
    integrations: [
        starlight({
            title: 'AGS Wiki',
            editLink: {
                baseUrl: 'https://github.com/Aylur/ags-docs/tree/main',
            },
            social: {
                github: 'https://github.com/Aylur/ags',
                discord: 'https://discord.gg/CXQpHwDuhY',
            },
            customCss: ['./src/styles/custom.css'],
            sidebar: [
                {
                    label: 'Configuration',
                    items: config.map(label => ({
                        label, link: 'config/' + label.toLowerCase().replaceAll(' ', '-'),
                    })),
                },
                {
                    label: 'Builtin Services',
                    collapsed: true,
                    autogenerate: { directory: '/services' },
                },
                {
                    label: 'Builtin Widgets',
                    collapsed: true,
                    items: widgets.map(label => ({
                        label, link: 'config/widgets#' + label.toLowerCase(),
                    })),
                },
            ],
        }),
    ],
});
