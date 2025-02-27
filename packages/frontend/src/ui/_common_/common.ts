/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { MenuItem } from '@/types/menu.js';
import * as os from '@/os.js';
import { instance } from '@/instance.js';
import { host } from '@/config.js';
import { i18n } from '@/i18n.js';
import { $i, iAmAdmin } from '@/account.js';
import { defaultStore } from '@/store.js';

function toolsMenuItems(): MenuItem[] {
	return [{
		type: 'link',
		to: '/scratchpad',
		text: i18n.ts.scratchpad,
		icon: 'ti ti-terminal-2',
	}, {
		type: 'link',
		to: '/api-console',
		text: 'API Console',
		icon: 'ti ti-terminal-2',
	}, {
		type: 'link',
		to: '/clicker',
		text: '🍪👈',
		icon: 'ti ti-cookie',
	}, ($i && (iAmAdmin || $i.policies.canManageCustomEmojis)) ? {
		type: 'link',
		to: '/custom-emojis-manager',
		text: i18n.ts.manageCustomEmojis,
		icon: 'ti ti-icons',
	} : undefined, ($i && (iAmAdmin || $i.policies.canManageAvatarDecorations)) ? {
		type: 'link',
		to: '/avatar-decorations',
		text: i18n.ts.manageAvatarDecorations,
		icon: 'ti ti-sparkles',
	} : undefined];
}

export function openInstanceMenu(ev: MouseEvent) {
	os.popupMenu([{
		text: instance.name ?? host,
		type: 'label',
	}, {
		type: 'link',
		text: i18n.ts.instanceInfo,
		icon: 'ti ti-info-circle',
		to: '/about',
	}, {
		type: 'link',
		text: i18n.ts.customEmojis,
		icon: 'ti ti-icons',
		to: '/about#emojis',
	}, /* {
		type: 'link',
		text: i18n.ts.federation,
		icon: 'ti ti-whirl',
		to: '/about#federation',
	}, */ {
		type: 'link',
		text: i18n.ts.charts,
		icon: 'ti ti-chart-line',
		to: '/about#charts',
	}, { type: 'divider' }, {
		type: 'link',
		text: i18n.ts.ads,
		icon: 'ti ti-ad',
		to: '/ads',
	}, ($i && (iAmAdmin || $i.policies.canInvite) && instance.disableRegistration) ? {
		type: 'link',
		to: '/invite',
		text: i18n.ts.invite,
		icon: 'ti ti-user-plus',
	} : undefined, {
		type: 'parent',
		text: i18n.ts.tools,
		icon: 'ti ti-tool',
		children: toolsMenuItems(),
	}, { type: 'divider' }, {
		type: 'link',
		text: i18n.ts.inquiry,
		icon: 'ti ti-help-circle',
		to: '/contact',
	}, (instance.impressumUrl) ? {
		text: i18n.ts.impressum,
		icon: 'ti ti-file-invoice',
		action: () => {
			window.open(instance.impressumUrl, '_blank', 'noopener');
		},
	} : undefined, (instance.tosUrl) ? {
		text: i18n.ts.termsOfService,
		icon: 'ti ti-notebook',
		action: () => {
			window.open(instance.tosUrl, '_blank', 'noopener');
		},
	} : undefined, (instance.privacyPolicyUrl) ? {
		text: i18n.ts.privacyPolicy,
		icon: 'ti ti-shield-lock',
		action: () => {
			window.open(instance.privacyPolicyUrl, '_blank', 'noopener');
		},
	} : undefined, (!instance.impressumUrl && !instance.tosUrl && !instance.privacyPolicyUrl) ? undefined : { type: 'divider' }, {
		text: i18n.ts.document,
		icon: 'ti ti-bulb',
		action: () => {
			window.open('https://misskey-hub.net/docs/for-users/', '_blank', 'noopener');
		},
	}, ($i) ? {
		text: i18n.ts._initialTutorial.launchTutorial,
		icon: 'ti ti-presentation',
		action: () => {
			defaultStore.set('accountSetupWizard', 0);
			location.href = '/onboarding';
		},
	} : undefined, {
		type: 'link',
		text: i18n.ts.aboutMisskey,
		to: '/about-misskey',
	}], ev.currentTarget ?? ev.target, {
		align: 'left',
	});
}

export function openToolsMenu(ev: MouseEvent) {
	os.popupMenu(toolsMenuItems(), ev.currentTarget ?? ev.target, {
		align: 'left',
	});
}
