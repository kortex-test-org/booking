]633;E;body "$RULES_BASE/project.md";ebce9ced-6341-4444-83e7-b8be7066142b]633;C
# Project: Booking App

## Description

A booking application built with Next.js and PocketBase.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4 & shadcn/ui
- PocketBase & @tanstack/react-query
- TypeScript & Biome

## Architecture

- Atomic Design

## Custom conventions

- Always use bun and bunx instead of node, npm or npx commands.
- Always follow atomic design.
- For installing new packages use bun add command, never edit package.json file yourself to install packages.
- shadcn/ui components install to @/components/ui directory.
- All pages text on russian.
- All prices in euro.

Detailed coding rules are split into instruction files in `.github/instructions/`.
