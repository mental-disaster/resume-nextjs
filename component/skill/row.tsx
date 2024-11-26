import { Badge, Col, Row } from 'reactstrap';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import clsx from 'clsx';

import { ISkill } from './ISkill';
import Util from '../common/Util';

export default function SkillRow({
  skill,
  index,
}: PropsWithChildren<{ skill: ISkill.Skill; index: number }>) {
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    setIsMobileScreen(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {index > 0 ? <hr /> : ''}
      <Row>
        <Col>
          {/* {skill.items.map((item) => JSON.stringify(item, null, 2))} */}
          {createCalculatedSkillItems(skill.items, isMobileScreen)}{' '}
          {/* isVerticalScreen을 인자로 전달 */}
        </Col>
      </Row>
    </div>
  );
}

function createCalculatedSkillItems(items: ISkill.Item[], isVerticalScreen: boolean) {
  const log = Util.debug('SkillRow:createCalculatedSkillItems');

  /**
   * @developer_commentary 단을 3단, 4단을 시도해봤지만 생각보다 이쁘게 나오지 않았고, 우선은 3단으로 한다. 만약 이쪽을 발전시킨다면 조금 더 이쁘고 능동적이게 데이터를 쪼갤 수 있는 방법을 찾으면 될 듯..
   */
  const layer = isVerticalScreen ? 2 : 3; 

  const list: ISkill.Item[][] = Array.from({ length: layer }, () => []);

  items.forEach((item, index) => {
    list[index % layer].push(item);
  });

  log('origin', items, items.length);
  log('list', list);

  return (
    <Row className={clsx(
      "mt-2 mt-md-0",
      isVerticalScreen ? 'pl-1' : 'pl-5'
    )}>
      {list.map((skills, index) => {
        return (
          <Col md={4} xs={6} key={index.toString()}>
            <ul>
              {skills.map((skill, skillIndex) => {
                return (
                  <li key={skillIndex.toString()}>
                    {createBadge(skill.level)}
                    {skill.title}
                  </li>
                );
              })}
            </ul>
          </Col>
        );
      })}
    </Row>
  );
}

function createBadge(level?: ISkill.Item['level']) {
  if (!level) {
    return '';
  }

  const color = (() => {
    switch (level) {
      case 3: {
        return 'primary';
      }
      case 2: {
        return 'secondary';
      }
      case 1:
      default: {
        return 'light';
      }
    }
  })();

  return (
    <span>
      <Badge pill color={color}>
        {level}
      </Badge>{' '}
    </span>
  );
}
