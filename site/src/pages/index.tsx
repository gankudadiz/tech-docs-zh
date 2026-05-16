import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const products = [
  {
    name: 'Filament',
    version: 'v4.x',
    status: '样板接入',
    pages: '5 个样板页面',
    stage: '结构验证中',
    docs: '/docs/filament/v4.x/introduction/overview',
    source: 'https://github.com/filamentphp/filament/tree/4.x/docs',
    description:
      'Laravel 生态的 Server-Driven UI 框架文档。当前保留官方原文快照，并接入一组 normalized 页面用于验证阅读、翻译和校对流程。',
  },
];

const workflow = [
  {label: '来源', value: 'official docs 4.x'},
  {label: '本地快照', value: 'raw / normalized'},
  {label: '阅读站', value: 'Docusaurus'},
];

export default function Home(): ReactNode {
  return (
    <Layout
      title="文档书架"
      description="本地优先的技术文档采集、翻译与阅读工作台">
      <main className={styles.page}>
        <section className={styles.masthead}>
          <div className={styles.mastheadCopy}>
            <p className={styles.kicker}>Local documentation workbench</p>
            <Heading as="h1" className={styles.title}>
              技术文档汉化工作台
            </Heading>
            <p className={styles.subtitle}>
              面向长期维护的中文技术文档站。先保存官方结构化原文，再清洗、翻译、校对和本地构建，让每个产品文档都按同一套阅读标准沉淀。
            </p>
            <dl className={styles.workflow} aria-label="项目流程">
              {workflow.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className={styles.preview}>
            <img
              src="/assets/filament/v4.x/screenshots/images/light/panels/dashboard.jpg"
              alt="Filament v4.x 面板截图"
            />
            <figcaption>Filament v4.x 官方界面截图，用于本地阅读样式和内容校对。</figcaption>
          </figure>
        </section>

        <section className={styles.library} aria-labelledby="library-heading">
          <div className={styles.sectionLead}>
            <p className={styles.kicker}>Library</p>
            <Heading as="h2" id="library-heading">
              文档书架
            </Heading>
          </div>

          {products.map((product) => (
            <article className={styles.product} key={product.name}>
              <div className={styles.productMain}>
                <div className={styles.productHeader}>
                  <span className={styles.status}>{product.status}</span>
                  <span>{product.version}</span>
                </div>
                <Heading as="h3">{product.name}</Heading>
                <p>{product.description}</p>
              </div>

              <dl className={styles.productMeta}>
                <div>
                  <dt>页面</dt>
                  <dd>{product.pages}</dd>
                </div>
                <div>
                  <dt>阶段</dt>
                  <dd>{product.stage}</dd>
                </div>
              </dl>

              <div className={styles.actions}>
                <Link className={`${styles.action} ${styles.actionPrimary}`} to={product.docs}>
                  开始阅读
                </Link>
                <Link className={styles.action} to={product.source}>
                  查看原文
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </Layout>
  );
}
