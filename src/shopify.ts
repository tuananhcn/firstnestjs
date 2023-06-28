import { ApiVersion, shopifyApi } from "@shopify/shopify-api";
import {restResources} from '@shopify/shopify-api/rest/admin/2022-07';
import '@shopify/shopify-api/adapters/node';
import path from "path";
require('dotenv').config();
// import dotenv from 'dotenv';
// dotenv.config();
export const shopify = shopifyApi({
    apiKey: process.env.apiKey,
    apiSecretKey: process.env.apiSecretKey,
    scopes: process.env.scopes.split(','),
    hostName: process.env.hostName,
    apiVersion: ApiVersion.April23,
    isEmbeddedApp: true,
    hostScheme: 'http',
    restResources
})