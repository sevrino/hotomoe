<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div :class="$style.root">
	<MkA v-if="instance.emailRequiredForSignup && $i && !$i.email" :class="$style.item" to="/settings/email">
		<span :class="$style.icon">
			<i class="ti ti-circle-x" style="color: var(--error);"></i>
		</span>
		<span :class="$style.title">{{ i18n.tsx.emailRegistrationRequiredBanner({ instance: instanceName }) }}</span>
	</MkA>
	<MkA v-if="$i && $i.email && !$i.emailVerified" :class="$style.item" to="/settings/email">
		<span :class="$style.icon">
			<i class="ti ti-mail"></i>
		</span>
		<span :class="$style.title">{{ i18n.ts.verificationEmailSent }}</span>
	</MkA>
	<MkA v-if="unresolvedReportCount > 0" :class="$style.item" to="/admin/abuses">
		<span :class="$style.icon">
			<i class="ti ti-alert-triangle" style="color: var(--warn);"></i>
		</span>
		<span :class="$style.title">{{ i18n.tsx.thereIsUnresolvedAbuseReport({ left: unresolvedReportCount }) }}</span>
	</MkA>
	<MkA v-if="($i?.isModerator ?? $i?.isAdmin) && !$i?.twoFactorEnabled" :class="$style.item" to="/settings/security">
		<span :class="$style.icon">
			<i class="ti ti-circle-key" style="color: var(--error);"></i>
		</span>
		<span :class="$style.title">{{ i18n.ts.youNeedToEnableTwoFactor }}</span>
	</MkA>
	<MkA
		v-for="announcement in $i?.unreadAnnouncements.filter(x => x.display === 'banner')"
		:key="announcement.id"
		:class="$style.item"
		to="/announcements"
	>
		<span :class="$style.icon">
			<i v-if="announcement.icon === 'info'" class="ti ti-info-circle"></i>
			<i v-else-if="announcement.icon === 'warning'" class="ti ti-alert-triangle" style="color: var(--warn);"></i>
			<i v-else-if="announcement.icon === 'error'" class="ti ti-circle-x" style="color: var(--error);"></i>
			<i v-else-if="announcement.icon === 'success'" class="ti ti-check" style="color: var(--success);"></i>
		</span>
		<span :class="$style.title">{{ announcement.title }}</span>
		<span :class="$style.body">{{ announcement.text }}</span>
	</MkA>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { instanceName } from '@/config.js';
import { instance } from '@/instance.js';
import { $i, iAmModerator } from '@/account.js';
import { i18n } from '@/i18n.js';
import { misskeyApi } from '@/scripts/misskey-api.js';

const unresolvedReportCount = ref<number>(0);

if (iAmModerator) {
	misskeyApi('admin/abuse-user-reports', {
		state: 'unresolved',
	}).then(reports => {
		unresolvedReportCount.value = reports.length;
	});
}
</script>

<style lang="scss" module>
.root {
	font-size: 15px;
	background: var(--panel);
}

.item {
	--height: 24px;
	font-size: 0.85em;

	display: flex;
	vertical-align: bottom;
	width: 100%;
	line-height: var(--height);
	height: var(--height);
	overflow: clip;
	contain: strict;
	background: var(--accent);
	color: var(--fgOnAccent);

	@container (max-width: 1000px) {
		display: block;
		text-align: center;

		> .body {
			display: none;
		}
	}
}

.icon {
	margin-left: 10px;
}

.title {
	padding: 0 10px;
	font-weight: bold;

	&:empty {
		display: none;
	}
}

.body {
	min-width: 0;
	flex: 1;
	overflow: clip;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
