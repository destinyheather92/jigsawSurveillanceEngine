import "dotenv/config";
import { prisma } from "../db/client";

const scenarios = [
  {
    title: "THE LEVER ROOM",
    description:
      "A rusted chair locks around your ribs. Across the room, another subject is wired to the same current. The timer above the door is not counting down. It is waiting for you to decide who the machine should believe.",
    choices: [
      "Pull the lever and redirect the current",
      "Wait for the timer to reveal the lock",
      "Confess your worst betrayal into the recorder",
      "Escape violently through the service hatch"
    ]
  },
  {
    title: "THE GLASS DEBT",
    description:
      "A corridor of hanging glass separates you from the exit. Each panel is etched with an unpaid debt, a name, and a camera lens. The speaker asks whether pain has value when no one is watching.",
    choices: [
      "Cut through the glass and keep moving",
      "Break the panel marked with another subject's name",
      "Wait and search the floor for the hidden key",
      "Sacrifice your safe route to unlock the other cell"
    ]
  },
  {
    title: "THE BREATH LEDGER",
    description:
      "The chamber measures every breath. A valve can flood your lungs with air or drain oxygen from the adjacent room. The display labels compassion as an inefficiency.",
    choices: [
      "Pull the lever and claim the oxygen",
      "Share air until the system recalculates",
      "Escape violently by smashing the intake pipe",
      "Tell the truth about why you were chosen"
    ]
  },
  {
    title: "THE RED DOOR",
    description:
      "Three doors unlock in sequence. The red door is closest, the black door is quiet, and the mirrored door repeats your pulse back through the walls. Only one path leaves a record clean enough to survive review.",
    choices: [
      "Open the red door immediately",
      "Wait and listen to the sequence behind the wall",
      "Betray the unseen subject to buy more time",
      "Solve the mirrored door pattern"
    ]
  }
];

async function main() {
  const count = await prisma.scenario.count();

  if (count > 0) {
    console.log(`Seed skipped. ${count} scenarios already exist.`);
    return;
  }

  await prisma.scenario.createMany({
    data: scenarios.map((scenario) => ({
      ...scenario,
      choices: JSON.stringify(scenario.choices)
    }))
  });

  console.log(`Seeded ${scenarios.length} trap scenarios.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
