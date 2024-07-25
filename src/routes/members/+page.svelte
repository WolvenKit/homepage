<script lang="ts">
  import wopss from "$assets/members/cyberwopps.png";
  import fuzzo from "$assets/members/fuzzo.png";
  import trade from "$assets/members/live_trade_reaction.gif";
  import Heading from "$lib/elements/Heading.svelte";
  import Section from "$lib/parts/Section.svelte";
  import MemberItem from "./MemberItem.svelte";
  import TeamSection from "./TeamSection.svelte";
</script>

<Section>
  <Heading>Our Members</Heading>

  <p class="max-w-3xl text-center">
    Here are the members of our Red Modding team.<br />
    This includes people who <code class="text-sm">[INSERT_REQUIREMENT_LIST_HERE]</code>, etc.<br />
    If you want to join our team you have to contribute to... idk what to write here, someone help me.
  </p>

  <TeamSection team="admin" title="Primary members" description="The leaders, the masters, the god">
    <MemberItem
      member={{
        name: "Fuzzo",
        bio: "The primary leader of the free world.",
        image: fuzzo,
        teams: ["admin", "WolvenKit", "REDcore"],
      }}
    />
    <MemberItem
      member={{
        name: "Trade",
        bio: "The trade of the rain.",
        image: trade,
        teams: ["admin", "wiki", "WolvenKit", "REDcore", "Website"],
        theme: "Witcher",
      }}
    />
    <MemberItem
      member={{
        name: "CyberWopps",
        bio: "The",
        image: wopss,
        teams: ["wiki", "CET", "WolvenKit", "REDcore", "Website"],
        theme: "Cyberpunk",
      }}
    />
  </TeamSection>

  <TeamSection team="REDcore">
    <MemberItem
      member={{
        name: "NotFuzzo",
        bio: "The primary leader of the.",
        image: fuzzo,
        teams: ["WolvenKit", "REDcore"],
      }}
    />
    <MemberItem
      member={{
        name: "NotFuzzo",
        bio: "The primary leader of the.",
        image: fuzzo,
        teams: ["WolvenKit", "REDcore"],
      }}
    />
    <MemberItem
      member={{
        name: "NotFuzzo",
        bio: "The primary leader of the.",
        image: fuzzo,
        teams: ["WolvenKit", "REDcore"],
      }}
    />
    <MemberItem
      member={{
        name: "NotFuzzo",
        bio: "The primary leader of the.",
        image: fuzzo,
        teams: ["WolvenKit", "REDcore"],
      }}
    />
    <MemberItem
      member={{
        name: "CyberWopps",
        bio: "The",
        image: wopss,
        teams: ["wiki", "CET", "WolvenKit", "REDcore", "Website"],
        theme: "Cyberpunk",
      }}
    />
    <MemberItem
      member={{
        name: "NotFuzzo",
        bio: "The primary leader of the.",
        image: fuzzo,
        teams: ["WolvenKit", "REDcore"],
      }}
    />
    <MemberItem
      member={{
        name: "Trade",
        bio: "The trade of the rain.",
        image: trade,
        teams: ["wiki", "WolvenKit", "REDcore", "Website"],
        theme: "Witcher",
      }}
    />
    <MemberItem
      member={{
        name: "NotFuzzo",
        bio: "The primary leader of the.",
        image: fuzzo,
        teams: ["WolvenKit", "REDcore"],
      }}
    />
    <MemberItem
      member={{
        name: "NotFuzzo",
        bio: "The primary leader of the.",
        image: fuzzo,
        teams: ["WolvenKit", "REDcore"],
      }}
    />
    <MemberItem
      member={{
        name: "NotFuzzo",
        bio: "The primary leader of the.",
        image: fuzzo,
        teams: ["WolvenKit", "REDcore"],
      }}
    />
    <MemberItem
      member={{
        name: "CyberWopps",
        bio: "The",
        image: wopss,
        teams: ["wiki", "CET", "WolvenKit", "REDcore", "Website"],
        theme: "Cyberpunk",
      }}
    />
  </TeamSection>

  <TeamSection team="Website">
    <MemberItem
      member={{
        name: "NotFuzzo",
        bio: "The primary leader of the.",
        image: fuzzo,
        teams: ["WolvenKit", "REDcore"],
      }}
    />
  </TeamSection>
</Section>
