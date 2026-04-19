import Giscus from '@giscus/react';

export default function Comments() {
  return (
    <div className="mt-16 pt-8 border-t border-border-subtle">
      <Giscus
        id="comments"
        repo="siddharthjain25/Blog-Comments"
        repoId="R_kgDOQ6cGsQ"
        category="Comments"
        categoryId="DIC_kwDOQ6cGsc4C0_xC"
        mapping="pathname"
        term="Welcome to Nexus Blog V2"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="transparent_dark"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
