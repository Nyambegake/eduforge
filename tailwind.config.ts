import type { Config } from "tailwindcss";
export default { content:["./src/**/*.{ts,tsx}"],
 theme:{extend:{colors:{ink:"#0E2233",ember:"#E8702A",steel:"#5B7184",mist:"#EEF2F5",leaf:"#1F8A70"},
 fontFamily:{sans:["var(--font-body)","system-ui","sans-serif"]}}},plugins:[]} satisfies Config;
