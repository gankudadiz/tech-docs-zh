import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import {docsProducts, getProductDefaultVersion} from '../data/docsCatalog';
import styles from './index.module.css';

export default function Home(): ReactNode {
  return (
    <Layout
      title="文档书架"
      description="本地优先的中文技术文档阅读站">
      <main className={styles.page}>
        <section className={styles.masthead}>
          <div className={styles.mastheadCopy}>
            <p className={styles.kicker}>Chinese Technical Documentation</p>
            <Heading as="h1" className={styles.title}>
              中文技术文档站
            </Heading>
            <p className={styles.subtitle}>
              面向长期维护的中文技术文档阅读站。每个框架保留一个统一入口，框架内部按版本组织和切换。
            </p>
          </div>
        </section>

        <section className={styles.library} aria-labelledby="library-heading">
          <div className={styles.sectionLead}>
            <p className={styles.kicker}>Library</p>
            <Heading as="h2" id="library-heading">
              已收录产品
            </Heading>
          </div>

          <div className={styles.productList}>
            {docsProducts.map((product) => {
              const defaultVersion = getProductDefaultVersion(product);

              return (
                <article className={styles.product} key={product.id}>
                  <div className={styles.productMain}>
                    <div className={styles.productHeader}>
                      <span className={styles.status}>{defaultVersion.status}</span>
                      <span>{product.versions.length} 个版本</span>
                    </div>
                    <Heading as="h3">{product.name}</Heading>
                    <p>{product.description}</p>

                    <div className={styles.versionList} aria-label={`${product.name} 版本`}>
                      {product.versions.map((version) => (
                        <Link
                          className={styles.versionPill}
                          key={version.slug}
                          to={version.docsPath}>
                          {version.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <dl className={styles.productMeta}>
                    <div>
                      <dt>默认版本</dt>
                      <dd>{defaultVersion.label}</dd>
                    </div>
                    <div>
                      <dt>页面</dt>
                      <dd>{defaultVersion.pages}</dd>
                    </div>
                    <div>
                      <dt>阶段</dt>
                      <dd>{defaultVersion.stage}</dd>
                    </div>
                  </dl>

                  <div className={styles.actions}>
                    <Link className={`${styles.action} ${styles.actionPrimary}`} to={defaultVersion.docsPath}>
                      开始阅读
                    </Link>
                    <Link className={styles.action} to={defaultVersion.sourceHref}>
                      查看原文
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </Layout>
  );
}
