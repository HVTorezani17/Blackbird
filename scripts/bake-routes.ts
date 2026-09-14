/**
 * Pré-calcula a geometria real (seguindo as ruas) das rotas de coleta MOCK
 * usando o motor de roteamento OSRM, e grava o resultado em
 * lib/mock/geometry/baked.json.
 *
 * Rode isto UMA VEZ, com internet disponível, de preferência no dia
 * anterior à apresentação — assim o protótipo funciona mesmo se a rede do
 * local da demonstração falhar (o app usa o arquivo "baked" com prioridade
 * máxima, antes de tentar qualquer chamada ao vivo).
 *
 *   npm run bake-routes
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { routes } from "../lib/mock/routes";
import { fetchOsrmRoute } from "../lib/geo/osrm";
import { densify } from "../lib/geo/fallback";
import type { GeoPoint } from "../lib/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "../lib/mock/geometry/baked.json");

async function main() {
  const output: Record<string, GeoPoint[]> = {};

  for (const route of routes) {
    process.stdout.write(`Calculando geometria para "${route.name}"... `);
    try {
      const raw = await fetchOsrmRoute(route.waypoints);
      output[route.id] = densify(raw, 15);
      console.log(`ok (${output[route.id].length} pontos)`);
    } catch (err) {
      console.log(`FALHOU (${(err as Error).message}) — rota omitida do arquivo baked.`);
    }
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf-8");
  console.log(`\nGravado em ${OUTPUT_PATH}`);
  console.log(
    "Commit este arquivo antes da apresentação para garantir que o app funcione mesmo sem internet no local.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
